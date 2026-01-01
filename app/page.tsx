"use client"

import { useState } from "react"
import QuoteStart from "@/components/quote-start"
import QuoteBuilder from "@/components/quote-builder"
import QuoteDashboard from "@/components/quote-dashboard"

type AppScreen = "dashboard" | "start" | "builder"

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>("dashboard")
  const [quoteId, setQuoteId] = useState<string | null>(null)

  const handleNewQuote = () => {
    setQuoteId(null)
    setScreen("start")
  }

  const handleStartQuote = (id: string) => {
    setQuoteId(id)
    setScreen("builder")
  }

  const handleBackToDashboard = () => {
    setQuoteId(null)
    setScreen("dashboard")
  }

  const handleViewQuote = (id: string) => {
    setQuoteId(id)
    setScreen("builder")
  }

  return (
    <main className="min-h-screen bg-background">
      {screen === "dashboard" && <QuoteDashboard onNewQuote={handleNewQuote} onViewQuote={handleViewQuote} />}
      {screen === "start" && <QuoteStart onStartQuote={handleStartQuote} onCancel={handleBackToDashboard} />}
      {screen === "builder" && quoteId && <QuoteBuilder quoteId={quoteId} onBack={handleBackToDashboard} />}
    </main>
  )
}
