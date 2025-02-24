// This file handles the Text-to-Speech functionality.

import { Request, Response } from 'express';
import { googleTTSClient } from '../config/googleTTSConfig';
import { protos } from '@google-cloud/text-to-speech'; // Import enums

export const speak = async (req: Request, res: Response) => {
    const { text, languageCode } = req.body;

    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        voice: { languageCode, ssmlGender: 'NEUTRAL' as const },
        audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
    };

    try {
        const response = await googleTTSClient.synthesizeSpeech(request);
        const audioContent = response[0].audioContent; // Extract audioContent
        res.set('Content-Type', 'audio/mpeg');
        res.send(audioContent); // Send the audio content as response
    } catch (error) {
        console.error('Error generating speech:', error);
        res.status(500).send({ error: 'Error generating speech' });
    }
};

