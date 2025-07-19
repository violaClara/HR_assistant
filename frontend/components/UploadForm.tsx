"use client"
import { useState } from 'react'
import axios from 'axios'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState("")

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)

    try {
      setStatus("Uploading...")
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/`, formData)
      setStatus("✅ Upload selesai!")
    } catch (err) {
      console.error(err)
      setStatus("❌ Gagal upload.")
    }
  }

  return (
    <div className="p-4 border rounded-xl space-y-3 bg-white shadow">
      <h2 className="font-semibold text-lg">📎 Upload CV (PDF)</h2>
      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
        Upload
      </button>
      {status && <p className="text-sm">{status}</p>}
    </div>
  )
}
