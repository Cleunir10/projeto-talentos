import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { getProblems } from '../lib/get-problems'
import type { Problem } from '../lib/get-problems'

export function Problems() {
  const problems = getProblems()

  const getStatusColor = (status: Problem['status']) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-yellow-500'
      case 'pending':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: Problem['status']) => {
    switch (status) {
      case 'resolved':
        return 'Resolvido'
      case 'in_progress':
        return 'Em Progresso'
      case 'pending':
        return 'Pendente'
      default:
        return status
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {problems.map((problem) => (
        <Card key={problem.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{problem.title}</CardTitle>
              <Badge className={getStatusColor(problem.status)}>
                {getStatusText(problem.status)}
              </Badge>
            </div>
            <CardDescription>{problem.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Solução:</strong> {problem.solution}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 