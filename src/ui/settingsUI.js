import * as THREE from 'three'

export function createSettingsUI(lights, cameraState) {
    const { spotlight, spotlightHelper, sun } = lights
    const { original, free } = cameraState

    // Basic Style-less Panel Container
    const panel = document.createElement('div')
    panel.id = 'settings-panel'
    panel.style.position = 'absolute'
    panel.style.top = '10px'
    panel.style.right = '10px'
    panel.style.backgroundColor = '#222'
    panel.style.color = '#fff'
    panel.style.padding = '15px'
    panel.style.fontFamily = 'monospace'
    panel.style.fontSize = '12px'
    panel.style.borderRadius = '5px'
    panel.style.zIndex = '9999'
    panel.style.display = 'none' // Hidden by default
    panel.style.flexDirection = 'column'
    panel.style.gap = '8px'
    panel.style.width = '270px'
    panel.style.maxHeight = '90vh'
    panel.style.overflowY = 'auto'

    // Prevent pointer lock / movement events from triggering when clicking inside the panel
    panel.addEventListener('click', (e) => e.stopPropagation())
    panel.addEventListener('mousedown', (e) => e.stopPropagation())
    panel.addEventListener('mouseup', (e) => e.stopPropagation())

    // Title
    const title = document.createElement('div')
    title.textContent = '--- SETTINGS PANEL ---'
    title.style.textAlign = 'center'
    title.style.fontWeight = 'bold'
    panel.appendChild(title)

    // Help Text
    const help = document.createElement('div')
    help.textContent = 'Press [P] to Open/Close'
    help.style.textAlign = 'center'
    help.style.color = '#888'
    help.style.marginBottom = '5px'
    panel.appendChild(help)

    // Helper function to create adjustment controls
    function createControlRow(parentEl, labelText, getVal, setVal, step = 1.0, onUpdate = null) {
        const row = document.createElement('div')
        row.style.display = 'flex'
        row.style.justifyContent = 'space-between'
        row.style.alignItems = 'center'

        const label = document.createElement('span')
        label.textContent = labelText

        const btnGroup = document.createElement('div')
        btnGroup.style.display = 'flex'
        btnGroup.style.gap = '5px'

        const valSpan = document.createElement('span')
        valSpan.style.width = '45px'
        valSpan.style.textAlign = 'center'
        valSpan.textContent = getVal().toFixed(1)

        const btnDec = document.createElement('button')
        btnDec.textContent = '-'
        btnDec.onclick = () => {
            setVal(getVal() - step)
            valSpan.textContent = getVal().toFixed(1)
            if (onUpdate) onUpdate()
        }

        const btnInc = document.createElement('button')
        btnInc.textContent = '+'
        btnInc.onclick = () => {
            setVal(getVal() + step)
            valSpan.textContent = getVal().toFixed(1)
            if (onUpdate) onUpdate()
        }

        btnGroup.appendChild(btnDec)
        btnGroup.appendChild(valSpan)
        btnGroup.appendChild(btnInc)

        row.appendChild(label)
        row.appendChild(btnGroup)
        parentEl.appendChild(row)
    }

    // --- CAMERA SECTION ---
    const cameraHeader = document.createElement('div')
    cameraHeader.textContent = '[Camera Settings]'
    cameraHeader.style.borderBottom = '1px solid #555'
    cameraHeader.style.marginTop = '5px'
    cameraHeader.style.fontWeight = 'bold'
    panel.appendChild(cameraHeader)

    // Active Camera Switch
    const rowCamSwitch = document.createElement('div')
    rowCamSwitch.style.display = 'flex'
    rowCamSwitch.style.justifyContent = 'space-between'
    rowCamSwitch.style.alignItems = 'center'
    const labelCam = document.createElement('span')
    labelCam.textContent = 'Active Camera:'
    const btnCam = document.createElement('button')
    btnCam.textContent = cameraState.active === original ? 'Original' : 'Freeform'

    // Position/rotation fields elements to enable/disable or hide
    const freeformFieldsContainer = document.createElement('div')
    freeformFieldsContainer.style.display = cameraState.active === original ? 'none' : 'flex'
    freeformFieldsContainer.style.flexDirection = 'column'
    freeformFieldsContainer.style.gap = '5px'

    btnCam.onclick = () => {
        if (cameraState.active === original) {
            cameraState.active = free
            btnCam.textContent = 'Freeform'
            freeformFieldsContainer.style.display = 'flex'
        } else {
            cameraState.active = original
            btnCam.textContent = 'Original'
            freeformFieldsContainer.style.display = 'none'
        }
    }
    rowCamSwitch.appendChild(labelCam)
    rowCamSwitch.appendChild(btnCam)
    panel.appendChild(rowCamSwitch)

    // Freeform Camera Controls (Translation & Rotation)
    const freeformTitle = document.createElement('div')
    freeformTitle.textContent = 'Freeform Camera Adjustments:'
    freeformTitle.style.color = '#aaa'
    freeformFieldsContainer.appendChild(freeformTitle)

    // Pos
    const freeformPosLabel = document.createElement('div')
    freeformPosLabel.textContent = '  Translation (Pos):'
    freeformPosLabel.style.color = '#888'
    freeformFieldsContainer.appendChild(freeformPosLabel)
    createControlRow(freeformFieldsContainer, '    X:', () => free.position.x, (val) => free.position.x = val, 1.0)
    createControlRow(freeformFieldsContainer, '    Y:', () => free.position.y, (val) => free.position.y = val, 1.0)
    createControlRow(freeformFieldsContainer, '    Z:', () => free.position.z, (val) => free.position.z = val, 1.0)

    // Rot (in radians, let's use 0.1 step)
    const freeformRotLabel = document.createElement('div')
    freeformRotLabel.textContent = '  Rotation (Angle):'
    freeformRotLabel.style.color = '#888'
    freeformFieldsContainer.appendChild(freeformRotLabel)
    createControlRow(freeformFieldsContainer, '    X:', () => free.rotation.x, (val) => free.rotation.x = val, 0.1)
    createControlRow(freeformFieldsContainer, '    Y:', () => free.rotation.y, (val) => free.rotation.y = val, 0.1)
    createControlRow(freeformFieldsContainer, '    Z:', () => free.rotation.z, (val) => free.rotation.z = val, 0.1)

    panel.appendChild(freeformFieldsContainer)

    // --- SPOTLIGHT SECTION ---
    const spotHeader = document.createElement('div')
    spotHeader.textContent = '[Spotlight]'
    spotHeader.style.borderBottom = '1px solid #555'
    spotHeader.style.marginTop = '10px'
    spotHeader.style.fontWeight = 'bold'
    panel.appendChild(spotHeader)

    // Toggle
    const rowSpotOnOff = document.createElement('div')
    rowSpotOnOff.style.display = 'flex'
    rowSpotOnOff.style.justifyContent = 'space-between'
    const labelSpotOnOff = document.createElement('span')
    labelSpotOnOff.textContent = 'State:'
    const btnSpotOnOff = document.createElement('button')
    btnSpotOnOff.textContent = spotlight.visible ? 'ON' : 'OFF'
    btnSpotOnOff.onclick = () => {
        spotlight.visible = !spotlight.visible
        if (spotlightHelper) spotlightHelper.visible = spotlight.visible
        btnSpotOnOff.textContent = spotlight.visible ? 'ON' : 'OFF'
    }
    rowSpotOnOff.appendChild(labelSpotOnOff)
    rowSpotOnOff.appendChild(btnSpotOnOff)
    panel.appendChild(rowSpotOnOff)

    // Intensity
    createControlRow(panel, 'Intensity:', () => spotlight.intensity, (val) => spotlight.intensity = Math.max(0, val), 2.0)

    // Translation
    const spotTransTitle = document.createElement('div')
    spotTransTitle.textContent = 'Translation (Pos):'
    spotTransTitle.style.color = '#aaa'
    spotTransTitle.style.paddingLeft = '5px'
    panel.appendChild(spotTransTitle)

    const onSpotUpdate = () => {
        if (spotlightHelper) spotlightHelper.update()
    }
    createControlRow(panel, '  X:', () => spotlight.position.x, (val) => {
        const delta = val - spotlight.position.x;
        spotlight.position.x = val
        spotlight.target.position.x += delta
    }, 1.0, onSpotUpdate)
    createControlRow(panel, '  Y:', () => spotlight.position.y, (val) => {
        const delta = val - spotlight.position.y;
        spotlight.position.y = val
        spotlight.target.position.y += delta
    }, 1.0, onSpotUpdate)
    createControlRow(panel, '  Z:', () => spotlight.position.z, (val) => {
        const delta = val - spotlight.position.z;
        spotlight.position.z = val
        spotlight.target.position.z += delta
    }, 1.0, onSpotUpdate)

    // Rotation
    const spotRotTitle = document.createElement('div')
    spotRotTitle.textContent = 'Rotation (Target):'
    spotRotTitle.style.color = '#aaa'
    spotRotTitle.style.paddingLeft = '5px'
    panel.appendChild(spotRotTitle)
    createControlRow(panel, '  X:', () => spotlight.target.position.x, (val) => spotlight.target.position.x = val, 1.0, onSpotUpdate)
    createControlRow(panel, '  Y:', () => spotlight.target.position.y, (val) => spotlight.target.position.y = val, 1.0, onSpotUpdate)
    createControlRow(panel, '  Z:', () => spotlight.target.position.z, (val) => spotlight.target.position.z = val, 1.0, onSpotUpdate)

    // --- SUN / DIRECTIONAL LIGHT SECTION ---
    const sunHeader = document.createElement('div')
    sunHeader.textContent = '[Sun (Dir Light)]'
    sunHeader.style.borderBottom = '1px solid #555'
    sunHeader.style.marginTop = '10px'
    sunHeader.style.fontWeight = 'bold'
    panel.appendChild(sunHeader)

    // Toggle
    const rowSunOnOff = document.createElement('div')
    rowSunOnOff.style.display = 'flex'
    rowSunOnOff.style.justifyContent = 'space-between'
    const labelSunOnOff = document.createElement('span')
    labelSunOnOff.textContent = 'State:'
    const btnSunOnOff = document.createElement('button')
    btnSunOnOff.textContent = sun.visible ? 'ON' : 'OFF'
    btnSunOnOff.onclick = () => {
        sun.visible = !sun.visible
        btnSunOnOff.textContent = sun.visible ? 'ON' : 'OFF'
    }
    rowSunOnOff.appendChild(labelSunOnOff)
    rowSunOnOff.appendChild(btnSunOnOff)
    panel.appendChild(rowSunOnOff)

    // Intensity
    createControlRow(panel, 'Intensity:', () => sun.intensity, (val) => sun.intensity = Math.max(0, val), 0.1)

    // Rotation (Target Position) ONLY - Translation removed
    const sunRotTitle = document.createElement('div')
    sunRotTitle.textContent = 'Rotation (Target):'
    sunRotTitle.style.color = '#aaa'
    sunRotTitle.style.paddingLeft = '5px'
    panel.appendChild(sunRotTitle)
    createControlRow(panel, '  X:', () => sun.target.position.x, (val) => sun.target.position.x = val, 1.0)
    createControlRow(panel, '  Y:', () => sun.target.position.y, (val) => sun.target.position.y = val, 1.0)
    createControlRow(panel, '  Z:', () => sun.target.position.z, (val) => sun.target.position.z = val, 1.0)

    // --- OBJECT TRANSFORM SECTION ---
    const transformHeader = document.createElement('div')
    transformHeader.textContent = '[Object Transform]'
    transformHeader.style.borderBottom = '1px solid #555'
    transformHeader.style.marginTop = '10px'
    transformHeader.style.fontWeight = 'bold'
    panel.appendChild(transformHeader)

    // Dropdown to select object
    const rowSelectObj = document.createElement('div')
    rowSelectObj.style.display = 'flex'
    rowSelectObj.style.justifyContent = 'space-between'
    rowSelectObj.style.alignItems = 'center'

    const labelSelect = document.createElement('span')
    labelSelect.textContent = 'Object:'

    const selectObj = document.createElement('select')
    selectObj.style.backgroundColor = '#333'
    selectObj.style.color = '#fff'
    selectObj.style.border = '1px solid #555'
    selectObj.style.padding = '2px'
    selectObj.style.fontFamily = 'monospace'

    const optNone = document.createElement('option')
    optNone.value = ''
    optNone.textContent = '-- None --'
    selectObj.appendChild(optNone)

    const optCustom = document.createElement('option');
    optCustom.value = 'Chest';     // Must exactly match the object.name from Step 1
    optCustom.textContent = 'Chest'; // Text visible to the user in the dropdown
    selectObj.appendChild(optCustom);

    const optCube1 = document.createElement('option')
    optCube1.value = 'Castle'
    optCube1.textContent = 'Castle'
    selectObj.appendChild(optCube1)

    const optCube2 = document.createElement('option')
    optCube2.value = 'Shell'
    optCube2.textContent = 'Shell'
    selectObj.appendChild(optCube2)

    rowSelectObj.appendChild(labelSelect)
    rowSelectObj.appendChild(selectObj)
    panel.appendChild(rowSelectObj)

    // Transform fields container
    const transformFieldsContainer = document.createElement('div')
    transformFieldsContainer.style.display = 'none'
    transformFieldsContainer.style.flexDirection = 'column'
    transformFieldsContainer.style.gap = '5px'
    panel.appendChild(transformFieldsContainer)

    let selectedObject = null;
    let selectionHelper = null;

    selectObj.onchange = () => {
        const val = selectObj.value;
        transformFieldsContainer.innerHTML = '';

        const scene = spotlight.parent;
        if (selectionHelper && scene) {
            scene.remove(selectionHelper);
            selectionHelper = null;
        }

        if (!val) {
            transformFieldsContainer.style.display = 'none';
            selectedObject = null;
            return;
        }

        if (!scene) {
            transformFieldsContainer.style.display = 'none';
            selectedObject = null;
            return;
        }

        selectedObject = scene.getObjectByName(val);
        if (!selectedObject) {
            transformFieldsContainer.style.display = 'none';
            return;
        }

        selectionHelper = new THREE.BoxHelper(selectedObject, 0x00ffcc);
        scene.add(selectionHelper);

        transformFieldsContainer.style.display = 'flex';

        // Add translation title
        const posTitle = document.createElement('div')
        posTitle.textContent = '  Translation (Pos):'
        posTitle.style.color = '#888'
        posTitle.style.marginTop = '5px'
        transformFieldsContainer.appendChild(posTitle)

        // Translation control rows
        createControlRow(transformFieldsContainer, '    X:',
            () => selectedObject.position.x,
            (newVal) => {
                selectedObject.position.x = newVal;
                if (selectedObject.userData && selectedObject.userData.boundingBox) {
                    selectedObject.userData.boundingBox.setFromObject(selectedObject);
                }
                if (selectionHelper) selectionHelper.update();
            }, 1.0)
        createControlRow(transformFieldsContainer, '    Y:',
            () => selectedObject.position.y,
            (newVal) => {
                selectedObject.position.y = newVal;
                if (selectedObject.userData && selectedObject.userData.boundingBox) {
                    selectedObject.userData.boundingBox.setFromObject(selectedObject);
                }
                if (selectionHelper) selectionHelper.update();
            }, 1.0)
        createControlRow(transformFieldsContainer, '    Z:',
            () => selectedObject.position.z,
            (newVal) => {
                selectedObject.position.z = newVal;
                if (selectedObject.userData && selectedObject.userData.boundingBox) {
                    selectedObject.userData.boundingBox.setFromObject(selectedObject);
                }
                if (selectionHelper) selectionHelper.update();
            }, 1.0)

        // Add rotation title
        const rotTitle = document.createElement('div')
        rotTitle.textContent = '  Rotation (Angle):'
        rotTitle.style.color = '#888'
        rotTitle.style.marginTop = '5px'
        transformFieldsContainer.appendChild(rotTitle)

        // Rotation control rows (using 0.1 radian steps)
        createControlRow(transformFieldsContainer, '    X:',
            () => selectedObject.rotation.x,
            (newVal) => {
                selectedObject.rotation.x = newVal;
                if (selectedObject.userData && selectedObject.userData.boundingBox) {
                    selectedObject.userData.boundingBox.setFromObject(selectedObject);
                }
                if (selectionHelper) selectionHelper.update();
            }, 0.1)
        createControlRow(transformFieldsContainer, '    Y:',
            () => selectedObject.rotation.y,
            (newVal) => {
                selectedObject.rotation.y = newVal;
                if (selectedObject.userData && selectedObject.userData.boundingBox) {
                    selectedObject.userData.boundingBox.setFromObject(selectedObject);
                }
                if (selectionHelper) selectionHelper.update();
            }, 0.1)
        createControlRow(transformFieldsContainer, '    Z:',
            () => selectedObject.rotation.z,
            (newVal) => {
                selectedObject.rotation.z = newVal;
                if (selectedObject.userData && selectedObject.userData.boundingBox) {
                    selectedObject.userData.boundingBox.setFromObject(selectedObject);
                }
                if (selectionHelper) selectionHelper.update();
            }, 0.1)
    };

    document.body.appendChild(panel)

    // Toggle Panel with 'P' key
    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyP') {
            if (panel.style.display === 'none') {
                panel.style.display = 'flex'
                document.exitPointerLock()
            } else {
                panel.style.display = 'none'
            }
        }
    })

    return panel
}
