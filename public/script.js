document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('whiteboard');
    const context = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const clearBtn = document.getElementById('clearBtn');
    const socket = io();

    let drawing = false;
    let current = { color: colorPicker.value, size: brushSize.value, x: 0, y: 0 };

    // Set canvas size based on window size
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 150;

    // Update color and brush size from controls
    colorPicker.addEventListener('change', (e) => current.color = e.target.value);
    brushSize.addEventListener('change', (e) => current.size = e.target.value);

    // Handle drawing start
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        current.x = e.clientX - canvas.getBoundingClientRect().left;
        current.y = e.clientY - canvas.getBoundingClientRect().top;
    });

    // Handle drawing movement
    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        drawLine(current.x, current.y, e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top, current.color, current.size, true);
        current.x = e.clientX - canvas.getBoundingClientRect().left;
        current.y = e.clientY - canvas.getBoundingClientRect().top;
    });

    // Handle drawing end
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);

    // Clear the canvas on button click
    clearBtn.addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('clear');
    });

    // Function to draw lines
    function drawLine(x0, y0, x1, y1, color, size, emit) {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = size;
        context.stroke();
        context.closePath();

        if (emit) {
            socket.emit('drawing', { x0, y0, x1, y1, color, size });
        }
    }

    // Receive drawing data from other clients
    socket.on('drawing', (data) => {
        drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.size, false);
    });

    // Handle clear event from server
    socket.on('clear', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });
});
