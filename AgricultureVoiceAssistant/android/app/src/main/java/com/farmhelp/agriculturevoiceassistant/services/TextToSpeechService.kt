class TextToSpeechService(private val context: Context) {
    private val tts = TextToSpeech(context) { }

    fun speak(text: String, language: String) {
        tts.language = Locale(language)
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
    }
} 