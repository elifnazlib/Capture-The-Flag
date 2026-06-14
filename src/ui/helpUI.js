export function createHelpUI() {
    // 1. Create Help Panel Container (Simple Monospace Box)
    const panel = document.createElement('div');
    panel.id = 'help-panel';
    panel.style.position = 'absolute';
    panel.style.top = '70px';
    panel.style.left = '10px';
    panel.style.backgroundColor = '#222';
    panel.style.color = '#fff';
    panel.style.padding = '15px';
    panel.style.fontFamily = 'monospace';
    panel.style.fontSize = '12px';
    panel.style.borderRadius = '5px';
    panel.style.zIndex = '9999';
    panel.style.display = 'flex'; // Display on load to guide user
    panel.style.flexDirection = 'column';
    panel.style.gap = '8px';
    panel.style.width = '300px';
    panel.style.maxHeight = '90vh';
    panel.style.overflowY = 'auto';

    // Prevent lock/movement interactions inside the panel
    panel.addEventListener('click', (e) => e.stopPropagation());
    panel.addEventListener('mousedown', (e) => e.stopPropagation());
    panel.addEventListener('mouseup', (e) => e.stopPropagation());

    // Title
    const title = document.createElement('div');
    title.textContent = '--- KEYBOARD SHORTCUTS ---';
    title.style.textAlign = 'center';
    title.style.fontWeight = 'bold';
    panel.appendChild(title);

    // Help Text
    const help = document.createElement('div');
    help.textContent = 'Press [H] to Open/Close';
    help.style.textAlign = 'center';
    help.style.color = '#888';
    help.style.marginBottom = '5px';
    panel.appendChild(help);

    // Categories and shortcuts helper
    function addCategory(headerText) {
        const header = document.createElement('div');
        header.textContent = `[${headerText}]`;
        header.style.borderBottom = '1px solid #555';
        header.style.marginTop = '10px';
        header.style.fontWeight = 'bold';
        panel.appendChild(header);
    }

    function addShortcut(key, desc) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';

        const keyEl = document.createElement('span');
        keyEl.textContent = key;
        keyEl.style.color = '#bd9a73';

        const descEl = document.createElement('span');
        descEl.textContent = desc;
        descEl.style.textAlign = 'right';
        descEl.style.color = '#ccc';

        row.appendChild(keyEl);
        row.appendChild(descEl);
        panel.appendChild(row);
    }

    // --- GAMEPLAY MOVEMENT ---
    addCategory('Movement');
    addShortcut('W / A / S / D', 'Move Character');
    addShortcut('Shift (Left)', 'Sprint / Speed');
    addShortcut('Left Mouse Click', 'Lock mouse / Tag');
    addShortcut('Mouse ', 'Look around');
    addShortcut('ESC', 'Unlock mouse pointer');

    // --- CINEMATIC CAMERA ---
    addCategory('Camera Actions');
    addShortcut('N', 'Toggle Name View');

    // --- RENDERING MODES ---
    addCategory('Shading & Settings');
    addShortcut('K', 'Toggle shaders');
    addShortcut('P', 'Toggle settings');

    // --- INTERACTION ---
    addCategory('Settings Panel');
    addShortcut('Active Camera Dropdown', 'Original / Freeform');
    addShortcut('Freeform Camera +/-', 'Translate / Rotate');
    addShortcut('Toggle Spotlight', 'ON / OFF');
    addShortcut('Spotlight +/-', 'Translate / Rotate');
    addShortcut('Toggle Directional Light', 'ON / OFF');
    addShortcut('Directional Light +/-', 'Rotate');
    addShortcut('Object Select Dropdown', 'Chest / Castle / Shell');
    addShortcut('Object +/-', 'Translate / Rotate');

    document.body.appendChild(panel);

    // Toggle listener for H key
    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyH') {
            if (panel.style.display === 'none') {
                panel.style.display = 'flex';
                document.exitPointerLock();
            } else {
                panel.style.display = 'none';
            }
        }
    });
}
