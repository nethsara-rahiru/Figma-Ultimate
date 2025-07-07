// script.js

// Page switching
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
}

// Canvas and components
const canvas = document.getElementById('canvas');
let components = [];

// Add component to canvas
function addComponent(type) {
  const id = 'comp-' + Date.now();
  const comp = {
    id,
    type,
    x: 50,
    y: 50,
    width: 150,
    height: 40,
    text: type === 'text' ? 'Sample Text' : '',
  };
  components.push(comp);
  renderComponents();
}

// Render all components on canvas
function renderComponents() {
  canvas.innerHTML = '';
  components.forEach(comp => {
    const el = document.createElement('div');
    el.className = 'component';
    el.style.left = comp.x + 'px';
    el.style.top = comp.y + 'px';
    el.style.width = comp.width + 'px';
    el.style.height = comp.height + 'px';
    el.id = comp.id;

    // Content
    if (comp.type === 'button') {
      const btn = document.createElement('button');
      btn.textContent = 'Button';
      el.appendChild(btn);
    } else if (comp.type === 'text') {
      const div = document.createElement('div');
      div.className = 'component-text';
      div.contentEditable = true;
      div.innerText = comp.text;
      div.addEventListener('input', (e) => {
        comp.text = e.target.innerText;
      });
      el.appendChild(div);
    } else if (comp.type === 'input') {
      const input = document.createElement('input');
      input.placeholder = 'Input';
      el.appendChild(input);
    }

    // Resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    el.appendChild(resizeHandle);

    canvas.appendChild(el);

    // Draggable with interact.js
    interact(el)
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true,
          }),
        ],
        listeners: {
          move(event) {
            comp.x += event.dx;
            comp.y += event.dy;
            el.style.left = comp.x + 'px';
            el.style.top = comp.y + 'px';
          },
        },
      })
      .resizable({
        edges: { bottom: true, right: true, top: false, left: false },
        listeners: {
          move(event) {
            comp.width = event.rect.width;
            comp.height = event.rect.height;
            el.style.width = comp.width + 'px';
            el.style.height = comp.height + 'px';
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 50, height: 30 },
            max: { width: 800, height: 600 },
          }),
        ],
      });
  });
}

// Export as PNG using html2canvas
function exportAsPNG() {
  import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js').then(({ default: html2canvas }) => {
    html2canvas(canvas).then(canvasEl => {
      const link = document.createElement('a');
      link.download = 'design.png';
      link.href = canvasEl.toDataURL('image/png');
      link.click();
    });
  });
}

// Export as basic HTML and CSS string and download
function exportAsHTML() {
  let html = `<div style="position:relative; width:${canvas.clientWidth}px; height:${canvas.clientHeight}px; border:1px solid #ddd;">\n`;

  components.forEach(comp => {
    let compHTML = '';
    const style = `position:absolute; left:${comp.x}px; top:${comp.y}px; width:${comp.width}px; height:${comp.height}px;`;

    if (comp.type === 'button') {
      compHTML = `<button style="width:100%; height:100%; background:#2563eb; color:#fff; border:none; border-radius:4px;">Button</button>`;
    } else if (comp.type === 'text') {
      compHTML = `<div style="font-size:16px; color:#1e293b; padding:0 6px; white-space:nowrap;">${comp.text}</div>`;
    } else if (comp.type === 'input') {
      compHTML = `<input placeholder="Input" style="width:100%; height:100%; padding:4px 6px; border:1px solid #94a3b8; border-radius:4px;" />`;
    }

    html += `<div style="${style}">${compHTML}</div>\n`;
  });

  html += `</div>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'design.html';
  link.click();
  URL.revokeObjectURL(url);
}
