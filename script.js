document.getElementById('obtenerHoroscopo').addEventListener('click', async () => {
    const signo = document.getElementById('signoSelect').value;
    const resultadoDiv = document.getElementById('resultado');

    if (!signo) {
        resultadoDiv.innerHTML = "<p style='color: red;'>Por favor, selecciona un signo zodiacal.</p>";
        return;
    }

    try {
        const response = await fetch(`/horoscopo/${signo}`);
        if (!response.ok) {
            throw new Error('Error al obtener el horóscopo');
        }
        const data = await response.json();
        resultadoDiv.innerHTML = `<h2>Horóscopo de ${signo}</h2><p>${data.horoscopo}</p>`;
    } catch (error) {
        resultadoDiv.innerHTML = `<p style='color: red;'>${error.message}</p>`;
    }
});