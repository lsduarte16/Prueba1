const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Endpoint para obtener horóscopo
app.get('/horoscopo/:signo', async (req, res) => {
    const { signo } = req.params;

    // Validar signo
    const signosValidos = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    if (!signosValidos.includes(signo)) {
        return res.status(400).json({ error: 'Signo no válido' });
    }

    try {
        const response = await axios.post(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.OPENAI_API_VERSION}`, {
            messages: [{ role: "user", content: `Dame el horóscopo para ${signo}` }],
            max_tokens: 150
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.AZURE_OPENAI_API_KEY,
            }
        });

        const horoscopo = response.data.choices[0].message.content;
        res.json({ horoscopo });
    } catch (error) {
        console.error('Error al comunicarse con Azure OpenAI:', error);
        res.status(500).json({ error: 'Error al obtener el horóscopo' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});