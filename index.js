        // DOM Elements
        const showPanelBtn = document.getElementById('show-panel-btn');
        const mainPanel = document.getElementById('main-panel');
        const defaultCodeCheck = document.getElementById('defaultCodeCheck');
        const myCodeCheck = document.getElementById('myCodeCheck');
        const itemsContainer = document.getElementById('items-container');
        const addItemBtn = document.getElementById('add-item-btn');
        const proceedBtn = document.getElementById('proceed-btn');
        const jsonOutput = document.getElementById('json-output');

        let itemCounter = 0;

        // --- CODE TEMPLATES ---
        const defaultCodeTemplate = {
          "pools": [
            {
              "rolls": 1,
              "conditions": [{"chance": 0.5, "condition": "random_chance"}],
              "entries": [
                {
                  "type": "item",
                  "name": "minecraft:armor_name",
                  "functions": [
                    {"function": "set_armor_trim", "material": "material_name", "pattern": "trim_name"},
                    {
                      "function": "specific_enchants",
                      "enchants": [
                        {"id": "protection", "level": 4},
                        {"id": "fire_protection", "level": 4},
                        {"id": "projectile_protection", "level": 4}
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "rolls": 1,
              "conditions": [{"chance": 0.5, "condition": "random_chance"}],
              "entries": [
                {
                  "type": "item",
                  "name": "minecraft:armor_name",
                  "functions": [
                    {"function": "set_armor_trim", "material": "material_name", "pattern": "trim_name"},
                    {
                      "function": "specific_enchants",
                      "enchants": [
                        {"id": "protection", "level": 4},
                        {"id": "fire_protection", "level": 4},
                        {"id": "projectile_protection", "level": 4}
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        };

        const myCodePoolTemplate = {
          "rolls": 1,
          "entries": [
            {
              "type": "item",
              "name": "minecraft:armor_name",
              "functions": [
                {"function": "set_armor_trim", "material": "material_name", "pattern": "trim_name"}
              ]
            }
          ]
        };

        // --- EVENT LISTENERS ---

        showPanelBtn.addEventListener('click', () => {
            showPanelBtn.style.display = 'none';
            mainPanel.style.display = 'block';
            updateUI();
        });

        defaultCodeCheck.addEventListener('change', () => {
            if (defaultCodeCheck.checked) {
                myCodeCheck.checked = false;
            } else {
                 myCodeCheck.checked = true; // Ensure one is always checked
            }
            updateUI();
        });

        myCodeCheck.addEventListener('change', () => {
            if (myCodeCheck.checked) {
                defaultCodeCheck.checked = false;
            } else {
                defaultCodeCheck.checked = true; // Ensure one is always checked
            }
            updateUI();
        });

        addItemBtn.addEventListener('click', () => {
            if (myCodeCheck.checked) {
                createItemBlock();
            }
        });

        proceedBtn.addEventListener('click', generateJson);

    function copyJson() {
      const range = document.createRange();
      const jsonOutput = document.getElementById("json-output");
      range.selectNode(jsonOutput);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      alert("Copied to clipboard!");
    }

        // --- CORE FUNCTIONS ---

        function updateUI() {
            // Reset container
            itemsContainer.innerHTML = '';
            itemCounter = 0;
            
            // Show/hide "Add Item" button
            addItemBtn.style.display = myCodeCheck.checked ? 'inline-block' : 'none';
            
            // Always create at least one item block
            createItemBlock();
        }

        function createItemBlock() {
            itemCounter++;
            const block = document.createElement('div');
            block.className = 'item-block';
            block.id = `item-block-${itemCounter}`;
            block.innerHTML = `
                <h3>Item ${itemCounter}</h3>
                <div class="input-group">
                    <label for="armor-name-${itemCounter}">Armor Name:</label>
                    <input type="text" id="armor-name-${itemCounter}" list="armor-list" placeholder="e.g., minecraft:diamond_chestplate">
                </div>
                <div class="input-group">
                    <label for="trim-name-${itemCounter}">Trim Name:</label>
                    <input type="text" id="trim-name-${itemCounter}" list="trim-list" placeholder="e.g., spire">
                </div>
                <div class="input-group">
                    <label for="material-name-${itemCounter}">Material Name:</label>
                    <input type="text" id="material-name-${itemCounter}" list="material-list" placeholder="e.g., amethyst">
                </div>
            `;
            itemsContainer.appendChild(block);
        }

        function generateJson() {
            let finalJson = {};

            if (defaultCodeCheck.checked) {
                // Deep copy the template to avoid modifying it
                let jsonObject = JSON.parse(JSON.stringify(defaultCodeTemplate));
                
                const armor = document.getElementById('armor-name-1').value || 'armor_name';
                const trim = document.getElementById('trim-name-1').value || 'trim_name';
                const material = document.getElementById('material-name-1').value || 'material_name';

                // Stringify, replace, then parse back to handle all occurrences
                let jsonString = JSON.stringify(jsonObject);
                jsonString = jsonString.replace(/"minecraft:armor_name"/g, `"${armor}"`);
                jsonString = jsonString.replace(/"trim_name"/g, `"${trim}"`);
                jsonString = jsonString.replace(/"material_name"/g, `"${material}"`);
                
                finalJson = JSON.parse(jsonString);

            } else { // My Code is checked
                finalJson = { pools: [] };

                for (let i = 1; i <= itemCounter; i++) {
                    const armor = document.getElementById(`armor-name-${i}`).value || 'armor_name';
                    const trim = document.getElementById(`trim-name-${i}`).value || 'trim_name';
                    const material = document.getElementById(`material-name-${i}`).value || 'material_name';
                    
                    // Deep copy the pool template
                    let newPool = JSON.parse(JSON.stringify(myCodePoolTemplate));

                    newPool.entries[0].name = armor;
                    newPool.entries[0].functions[0].pattern = trim;
                    newPool.entries[0].functions[0].material = material;
                    
                    finalJson.pools.push(newPool);
                }
            }

            // Display the final, formatted JSON
            jsonOutput.textContent = JSON.stringify(finalJson, null, 2);
        }

        // --- UTILITY FUNCTIONS ---

        function showTooltip(message) {
            // Remove any existing tooltip
            const existingTooltip = document.querySelector('.tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }

            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = message;
            document.body.appendChild(tooltip);

            // Fade in
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);

            // Fade out and remove after a few seconds
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.remove();
                }, 500); // Wait for transition to finish
            }, 3000); // 3 seconds
        }

        // Initialize the UI on page load
        updateUI();
