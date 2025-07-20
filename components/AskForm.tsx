"use client"
import { useState } from 'react'
import axios from 'axios'

export default function AskForm() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)
     try {
      // 1. Kirim pertanyaan → backend mulai proses
      const form = new FormData()
      form.append("question", question)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ask/`, form)

      const taskId = res.data.task_id
      if (!taskId) throw new Error("Gagal ambil task_id")

      // 2. Polling tiap 2 detik untuk cek status
      const checkInterval = 2000
      const maxRetries = 60 // timeout setelah 2 menit
      let retries = 0

      const poll = async () => {
        try {
          const statusRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ask/status/${taskId}`)
          if (statusRes.data.status === "completed") {
            setAnswer(statusRes.data.response)
            setLoading(false)
          } else if (statusRes.data.status === "failed") {
            setAnswer("Gagal memproses jawaban 😵")
            setLoading(false)
          } else {
            if (retries < maxRetries) {
              retries++
              setTimeout(poll, checkInterval)
            } else {
              setAnswer("⏳ Timeout: jawaban terlalu lama.")
              setLoading(false)
            }
          }
        } catch (err) {
          console.error(err)
          setAnswer("❌ Gagal polling ke server.")
          setLoading(false)
        }
      }

      poll()

    } catch (err) {
      console.error(err)
      setAnswer("❌ Gagal kirim pertanyaan.")
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-xl space-y-3 bg-white shadow">
      <h2 className="font-semibold text-lg">🧠 Tanya ke AI</h2>
      <textarea
        rows={3}
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className="w-full border p-2 rounded-lg"
        placeholder="Contoh: Siapa kandidat yang cocok jadi admin?"
      />
      <button onClick={handleAsk} className="bg-yellow-500 text-black px-4 py-2 rounded-xl hover:bg-yellow-600">
        {loading ? "⏳ Menjawab..." : "Tanya"}
      </button>

      {answer && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-line">
          <strong>Jawaban AI:</strong><br />
          {answer}
        </div>
      )}
    </div>
  )
}
