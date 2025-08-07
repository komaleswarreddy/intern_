import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, FileText } from 'lucide-react'
import { Form, FormResponse } from '@/types'
import { formApi, responseApi } from '@/utils/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [forms, setForms] = useState<Form[]>([])
  const [responses, setResponses] = useState<Record<string, FormResponse[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formsResponse = await formApi.getAll()
        if (formsResponse.success && formsResponse.data) {
          setForms(formsResponse.data)
          
          // Fetch responses for each form - handle errors gracefully
          const responsesData: Record<string, FormResponse[]> = {}
          for (const form of formsResponse.data) {
            if (form._id) {
              try {
                const responseData = await responseApi.getByFormId(form._id)
                if (responseData.success && responseData.data) {
                  responsesData[form._id] = responseData.data
                } else {
                  // If no responses exist, set empty array
                  responsesData[form._id] = []
                }
              } catch (error) {
                // If API returns 404 (no responses), set empty array
                console.log(`No responses found for form ${form._id}`)
                responsesData[form._id] = []
              }
            }
          }
          setResponses(responsesData)
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getTotalResponses = () => {
    return Object.values(responses).reduce((total, formResponses) => {
      return total + formResponses.length
    }, 0)
  }

  const getFormStats = (formId: string) => {
    const formResponses = responses[formId] || []
    return {
      totalResponses: formResponses.length,
      lastResponse: formResponses.length > 0 
        ? new Date(formResponses[formResponses.length - 1].submittedAt || '').toLocaleDateString()
        : 'No responses'
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your forms and analyze responses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.length}</div>
            <p className="text-xs text-muted-foreground">
              Active forms in your account
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalResponses()}</div>
            <p className="text-xs text-muted-foreground">
              All-time form submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Responses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forms.length > 0 ? Math.round(getTotalResponses() / forms.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per form average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Forms List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Your Forms</h2>
        
        {forms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No forms yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first form to start collecting responses
              </p>
              <Button>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => {
              const stats = getFormStats(form._id || '')
              return (
                <Card key={form._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{form.title}</CardTitle>
                        <CardDescription>
                          {form.description || 'No description'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Total Responses</p>
                        <p className="text-2xl font-bold">{stats.totalResponses}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Response</p>
                        <p className="text-sm text-muted-foreground">{stats.lastResponse}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Questions</p>
                        <p className="text-sm text-muted-foreground">{form.questions.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 