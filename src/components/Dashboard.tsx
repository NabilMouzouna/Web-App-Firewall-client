'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import LogsSection from '@/components/LogsSection'
import RulesSection from '@/components/RulesSection'

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([])
  const [rules, setRules] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const refreshLogs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/logs')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error('Error fetching logs:', error)
      setError('Failed to fetch logs. Please try again.')
    }
  }

  const fetchRules = useCallback(async (): Promise<any[]> => {
    try {
      console.log('Fetching rules...')
      const response = await fetch('http://localhost:8080/api/admin/rules')
      console.log('Response status:', response.status)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const text = await response.text()
      console.log('Response text:', text)
      const data = JSON.parse(text)
      console.log('Parsed data:', data)
      setRules(data)
      setError(null)
      return data // Ensure it returns the data
    } catch (error) {
      console.error('Error fetching rules:', error)
      setRules([])
      setError('Failed to fetch rules. Please check the console for more details.')
      return [] // Return an empty array in case of an error
    }
  }, [])

  const addRule = async (rule: { type: string; value: string; action: 'ALLOWED' | 'BLOCKED' }) => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await fetchRules() // Call fetchRules after adding a new rule
    } catch (error) {
      console.error('Error adding rule:', error)
      setError('Failed to add rule. Please try again.')
    }
  }

  const deleteRule = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/rules/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await fetchRules() // Call fetchRules after deleting a rule
    } catch (error) {
      console.error('Error deleting rule:', error)
      setError('Failed to delete rule. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <LogsSection logs={logs} refreshLogs={refreshLogs} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <RulesSection rules={rules} fetchRules={fetchRules} addRule={addRule} deleteRule={deleteRule} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}