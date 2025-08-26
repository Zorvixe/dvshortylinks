"use client"
import { Button } from "react-bootstrap"
import { FaTelegram } from "react-icons/fa"

const TelegramShare = ({ shortUrl }) => {
  const shareToTelegram = () => {
    const message = `Check this link: ${shortUrl}`
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(message)}`

    // Open in popup
    window.open(telegramUrl, "_blank", "width=550,height=420")

    // Track the share
    fetch(`${process.env.REACT_APP_API_URL}/api/track-telegram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        shortCode: shortUrl.split("/").pop(),
      }),
    })
  }

  return (
    <Button variant="primary" onClick={shareToTelegram}>
      <FaTelegram className="mr-2" />
      Share on Telegram
    </Button>
  )
}

export default TelegramShare
