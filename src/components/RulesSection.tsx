import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from './ui/input'

interface RulesSectionProps {
  rules: any[]
  fetchRules: () => Promise<any[]>
  addRule: (rule: { type: string; value: string; action: 'ALLOWED' | 'BLOCKED' }) => Promise<void>
  deleteRule: (id: string) => Promise<void>
}

export default function RulesSection({ rules, fetchRules, addRule, deleteRule }: RulesSectionProps) {
  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [action, setAction] = useState<'ALLOWED' | 'BLOCKED'>('ALLOWED')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadRules = async () => {
      setIsLoading(true)
      try {
        const fetchedRules = await fetchRules()
        if (!fetchedRules || fetchedRules.length === 0) {
          console.log('No rules found. Doing nothing.')
          return
        }
      } catch (err) {
        console.error('Error loading rules:', err)
        setError('Failed to load rules. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    loadRules()
  }, [fetchRules])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await addRule({ type, value, action })
      setType('')
      setValue('')
      setAction('ALLOWED')
    } catch (err) {
      console.error('Error adding rule:', err)
      setError('Failed to add rule. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteRule(id)
      await fetchRules()
    } catch (err) {
      console.error('Error deleting rule:', err)
      setError('Failed to delete rule. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ROUTE">path of URL</SelectItem>
              <SelectItem value="REQUEST-BODY">data in the body of request</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='Enter something like /admin or <script> ...'
            required
          />
        </div>
        <div>
          <Label>Action</Label>
          <RadioGroup value={action} onValueChange={(value) => setAction(value as 'ALLOWED' | 'BLOCKED')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ALLOWED" id="allowed" />
              <Label htmlFor="allowed">Allowed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="BLOCKED" id="blocked" />
              <Label htmlFor="blocked">Blocked</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Rule'}
        </Button>
      </form>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div>Loading rules...</div>
      ) : rules.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.type}</TableCell>
                <TableCell>{rule.value}</TableCell>
                <TableCell>{rule.action}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(rule.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Alert>
          <AlertDescription>No rules found. Add a rule to get started.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}