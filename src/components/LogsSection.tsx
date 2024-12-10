import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface LogsSectionProps {
  logs: any[]
  refreshLogs: () => void
}

export default function LogsSection({ logs, refreshLogs }: LogsSectionProps) {
  return (
    <div>
      <Button onClick={refreshLogs} className="mb-4">Refresh Logs</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Malicious</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Url</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell>{(log.malicious)? "Yes" : "No"}</TableCell>
              <TableCell>{log.method}</TableCell>
              <TableCell>{log.url}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

