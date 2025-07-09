import React, { useState } from 'react';

export default function FeedValidator() {
  const [feedUrl, setFeedUrl] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateFeed = async () => {
    setLoading(true);
    setValidationResults(null);
    
    try {
      // Fetch the feed
      const url = feedUrl.startsWith("http") && !feedUrl.includes("localhost")
        ? `https://corsproxy.io/?url=${encodeURIComponent(feedUrl)}`
        : feedUrl;
      
      const response = await fetch(url);
      const text = await response.text();
      
      // Parse XML
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");
      
      // Check for parsing errors
      const parserError = doc.querySelector("parsererror");
      if (parserError) {
        throw new Error("XML parsing failed: " + parserError.textContent);
      }
      
      const results = {
        isValid: true,
        errors: [],
        warnings: [],
        info: {},
        valueBlocks: []
      };
      
      // Basic RSS structure validation
      const channel = doc.querySelector("channel");
      if (!channel) {
        results.errors.push("Missing <channel> element");
        results.isValid = false;
      }
      
      // Check required elements
      const requiredElements = ['title', 'description', 'link'];
      requiredElements.forEach(element => {
        if (!channel?.querySelector(element)) {
          results.errors.push(`Missing required element: <${element}>`);
          results.isValid = false;
        }
      });
      
      // Check for podcast namespace
      const rssElement = doc.querySelector("rss");
      const hasPodcastNamespace = rssElement?.getAttribute("xmlns:podcast")?.includes("podcastindex.org");
      if (!hasPodcastNamespace) {
        results.warnings.push("Missing podcast namespace (xmlns:podcast)");
      }
      
      // Find and validate value blocks
      const podcastNamespace = "https://podcastindex.org/namespace/1.0";
      const valueElements = doc.getElementsByTagNameNS(podcastNamespace, "value");
      
      if (valueElements.length === 0) {
        // Try without namespace
        const valueElementsNoNS = doc.querySelectorAll("value");
        if (valueElementsNoNS.length === 0) {
          results.warnings.push("No <podcast:value> blocks found");
        } else {
          Array.from(valueElementsNoNS).forEach((valueBlock, index) => {
            results.valueBlocks.push(validateValueBlock(valueBlock, index, results));
          });
        }
      } else {
        Array.from(valueElements).forEach((valueBlock, index) => {
          results.valueBlocks.push(validateValueBlock(valueBlock, index, results));
        });
      }
      
      // Check for iTunes namespace
      const hasItunesNamespace = rssElement?.getAttribute("xmlns:itunes")?.includes("itunes.com");
      if (!hasItunesNamespace) {
        results.warnings.push("Missing iTunes namespace (xmlns:itunes)");
      }
      
      // Check for items
      const items = doc.querySelectorAll("item");
      results.info.itemCount = items.length;
      
      if (items.length === 0) {
        results.warnings.push("No episodes found");
      }
      
      // Validate each item
      Array.from(items).forEach((item, index) => {
        validateItem(item, index, results);
      });
      
      setValidationResults(results);
      
    } catch (error) {
      setValidationResults({
        isValid: false,
        errors: [error.message],
        warnings: [],
        info: {},
        valueBlocks: []
      });
    }
    
    setLoading(false);
  };

  const validateValueBlock = (valueBlock, index, results) => {
    const block = {
      index,
      isValid: true,
      errors: [],
      warnings: [],
      recipients: []
    };
    
    // Check required attributes
    const type = valueBlock.getAttribute("type");
    const method = valueBlock.getAttribute("method");
    const suggested = valueBlock.getAttribute("suggested");
    
    if (type !== "lightning") {
      block.errors.push("Value block type should be 'lightning'");
      block.isValid = false;
    }
    
    if (method !== "split") {
      block.errors.push("Value block method should be 'split'");
      block.isValid = false;
    }
    
    if (!suggested || isNaN(parseInt(suggested))) {
      block.warnings.push("Missing or invalid suggested amount");
    }
    
    // Validate recipients
    const podcastNamespace = "https://podcastindex.org/namespace/1.0";
    let recipientElements = valueBlock.getElementsByTagNameNS(podcastNamespace, "valueRecipient");
    
    if (recipientElements.length === 0) {
      recipientElements = valueBlock.querySelectorAll("valueRecipient");
    }
    
    if (recipientElements.length === 0) {
      block.errors.push("No value recipients found");
      block.isValid = false;
    } else {
      let totalSplit = 0;
      
      Array.from(recipientElements).forEach((recipient, recIndex) => {
        const recipientInfo = {
          index: recIndex,
          name: recipient.getAttribute("name"),
          type: recipient.getAttribute("type"),
          address: recipient.getAttribute("address"),
          split: recipient.getAttribute("split")
        };
        
        // Validate recipient
        if (!recipientInfo.name) {
          block.errors.push(`Recipient ${recIndex + 1}: Missing name`);
          block.isValid = false;
        }
        
        if (!recipientInfo.type || !["lightning", "node"].includes(recipientInfo.type)) {
          block.errors.push(`Recipient ${recIndex + 1}: Invalid type (should be 'lightning' or 'node')`);
          block.isValid = false;
        }
        
        if (!recipientInfo.address) {
          block.errors.push(`Recipient ${recIndex + 1}: Missing address`);
          block.isValid = false;
        }
        
        if (recipientInfo.type === "node") {
          // Validate node pubkey
          if (recipientInfo.address.length !== 66) {
            block.errors.push(`Recipient ${recIndex + 1}: Invalid node pubkey length`);
            block.isValid = false;
          }
          
          if (!recipientInfo.address.startsWith("02") && !recipientInfo.address.startsWith("03")) {
            block.errors.push(`Recipient ${recIndex + 1}: Invalid node pubkey format`);
            block.isValid = false;
          }
        } else if (recipientInfo.type === "lightning") {
          // Validate Lightning address
          if (!recipientInfo.address.includes("@")) {
            block.errors.push(`Recipient ${recIndex + 1}: Invalid Lightning address format`);
            block.isValid = false;
          }
        }
        
        if (recipientInfo.split) {
          totalSplit += parseInt(recipientInfo.split);
        }
        
        block.recipients.push(recipientInfo);
      });
      
      if (totalSplit !== 100) {
        block.warnings.push(`Total split should be 100%, got ${totalSplit}%`);
      }
    }
    
    if (!block.isValid) {
      results.isValid = false;
    }
    
    return block;
  };

  const validateItem = (item, index, results) => {
    const requiredItemElements = ['title', 'description', 'pubDate', 'guid'];
    requiredItemElements.forEach(element => {
      if (!item.querySelector(element)) {
        results.warnings.push(`Episode ${index + 1}: Missing ${element}`);
      }
    });
    
    // Check for episode-specific value blocks
    const podcastNamespace = "https://podcastindex.org/namespace/1.0";
    const itemValueElements = item.getElementsByTagNameNS(podcastNamespace, "value");
    if (itemValueElements.length > 0) {
      results.info.hasEpisodeValueBlocks = true;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>RSS Feed Validator</h2>
      <p>Validate your RSS feeds and check value blocks for Lightning payments</p>
      
      <div style={{ marginBottom: "1rem" }}>
        <input
          style={{ width: "100%", marginBottom: "0.5rem", padding: "8px" }}
          value={feedUrl}
          onChange={(e) => setFeedUrl(e.target.value)}
          placeholder="Enter RSS feed URL (e.g., http://localhost:3000/enhanced-demu-feed.xml)"
        />
        <button 
          onClick={validateFeed} 
          disabled={loading || !feedUrl}
          style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
        >
          {loading ? "Validating..." : "Validate Feed"}
        </button>
      </div>

      {validationResults && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Validation Results</h3>
          
          {/* Overall Status */}
          <div style={{ 
            padding: "1rem", 
            backgroundColor: validationResults.isValid ? "#e8f5e8" : "#ffe8e8",
            borderRadius: "8px",
            marginBottom: "1rem"
          }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: validationResults.isValid ? "#2e7d32" : "#c62828" }}>
              {validationResults.isValid ? "✅ Feed is Valid" : "❌ Feed has Errors"}
            </h4>
            <div style={{ fontSize: "14px" }}>
              <strong>Info:</strong> {validationResults.info.itemCount || 0} episodes, 
              {validationResults.info.hasEpisodeValueBlocks ? " with episode-specific value blocks" : " channel-level value blocks only"}
            </div>
          </div>
          
          {/* Errors */}
          {validationResults.errors.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ color: "#c62828" }}>❌ Errors ({validationResults.errors.length})</h4>
              <ul style={{ backgroundColor: "#ffe8e8", padding: "1rem", borderRadius: "4px" }}>
                {validationResults.errors.map((error, index) => (
                  <li key={index} style={{ marginBottom: "0.5rem" }}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Warnings */}
          {validationResults.warnings.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ color: "#f57c00" }}>⚠️ Warnings ({validationResults.warnings.length})</h4>
              <ul style={{ backgroundColor: "#fff3e0", padding: "1rem", borderRadius: "4px" }}>
                {validationResults.warnings.map((warning, index) => (
                  <li key={index} style={{ marginBottom: "0.5rem" }}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Value Blocks */}
          {validationResults.valueBlocks.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h4>💰 Value Blocks ({validationResults.valueBlocks.length})</h4>
              {validationResults.valueBlocks.map((block, index) => (
                <div key={index} style={{ 
                  marginBottom: "1rem", 
                  padding: "1rem", 
                  backgroundColor: block.isValid ? "#e8f5e8" : "#ffe8e8",
                  borderRadius: "4px"
                }}>
                  <h5 style={{ margin: "0 0 0.5rem 0" }}>
                    Value Block {index + 1} {block.isValid ? "✅" : "❌"}
                  </h5>
                  
                  {block.errors.length > 0 && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <strong style={{ color: "#c62828" }}>Errors:</strong>
                      <ul style={{ margin: "0.25rem 0", paddingLeft: "1.5rem" }}>
                        {block.errors.map((error, errIndex) => (
                          <li key={errIndex} style={{ fontSize: "14px" }}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {block.warnings.length > 0 && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <strong style={{ color: "#f57c00" }}>Warnings:</strong>
                      <ul style={{ margin: "0.25rem 0", paddingLeft: "1.5rem" }}>
                        {block.warnings.map((warning, warnIndex) => (
                          <li key={warnIndex} style={{ fontSize: "14px" }}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <strong>Recipients ({block.recipients.length}):</strong>
                    <ul style={{ margin: "0.25rem 0", paddingLeft: "1.5rem" }}>
                      {block.recipients.map((recipient, recIndex) => (
                        <li key={recIndex} style={{ fontSize: "14px" }}>
                          <strong>{recipient.name}</strong> ({recipient.type}) - {recipient.address} ({recipient.split}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quick Test Links */}
          <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#e3f2fd", borderRadius: "8px" }}>
            <h4>🧪 Quick Test Links</h4>
            <p style={{ fontSize: "14px", marginBottom: "1rem" }}>
              Test these pre-made feeds in your app:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => setFeedUrl("http://localhost:3000/enhanced-demu-feed.xml")}
                style={{ padding: "8px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", textAlign: "left" }}
              >
                Enhanced de-mu Feed (4 episodes, mixed recipients)
              </button>
              <button 
                onClick={() => setFeedUrl("http://localhost:3000/customizable-podcast-feed.xml")}
                style={{ padding: "8px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", textAlign: "left" }}
              >
                Customizable Template (2 episodes, single recipient)
              </button>
              <button 
                onClick={() => setFeedUrl("http://localhost:3000/real-podcast-feed.xml")}
                style={{ padding: "8px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", textAlign: "left" }}
              >
                Real Podcast Feed (3 episodes, multiple recipients)
              </button>
              <button 
                onClick={() => setFeedUrl("http://localhost:3000/lightning-address-feed.xml")}
                style={{ padding: "8px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", textAlign: "left" }}
              >
                Lightning Address Only (1 episode, Lightning addresses)
              </button>
              <button 
                onClick={() => setFeedUrl("http://localhost:3000/node-only-feed.xml")}
                style={{ padding: "8px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", textAlign: "left" }}
              >
                Node Pubkey Only (1 episode, keysend testing)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 