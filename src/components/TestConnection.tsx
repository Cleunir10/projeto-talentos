import React, { useEffect, useState } from 'react'
import { supabase, testDatabaseConnection } from '../lib/supabase'

interface Produto {
  id: string
  nome: string
  descricao: string | null
  preco: number
  imagem_url: string | null
}

interface ConnectionState {
  status: 'checking' | 'connected' | 'failed'
  isAuthenticated: boolean
  error: string | null
}

export const TestConnection: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [connection, setConnection] = useState<ConnectionState>({
    status: 'checking',
    isAuthenticated: false,
    error: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true)
        setConnection(prev => ({ ...prev, status: 'checking', error: null }))

        console.log('Iniciando teste de conexão...')
        
        // Testar a conexão primeiro
        const connectionTest = await testDatabaseConnection()
        
        if (!connectionTest.success) {
          console.error('Erro de conexão:', connectionTest.error)
          setConnection({
            status: 'failed',
            isAuthenticated: connectionTest.isAuthenticated,
            error: `Erro de conexão: ${connectionTest.error}${
              connectionTest.statusCode === '401' 
                ? ' (Não autorizado - verifique a autenticação)'
                : ''
            }`
          })
          return
        }

        setConnection({
          status: 'connected',
          isAuthenticated: connectionTest.isAuthenticated,
          error: null
        })
        
        console.log('Conexão estabelecida com sucesso')

        // Buscar os produtos
        const { data: produtos, error: productsError } = await supabase
          .from('produtos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (productsError) {
          console.error('Erro ao buscar produtos:', productsError)
          setConnection(prev => ({
            ...prev,
            error: `Erro ao buscar produtos: ${productsError.message}`
          }))
          return
        }

        console.log('Produtos carregados:', produtos?.length || 0)
        setProdutos(produtos || [])
      } catch (err) {
        console.error('Erro inesperado:', err)
        setConnection({
          status: 'failed',
          isAuthenticated: false,
          error: 'Erro inesperado ao conectar com o banco de dados'
        })
      } finally {
        setIsLoading(false)
      }
    }

    testConnection()
  }, [])

  const getStatusColor = () => {
    switch (connection.status) {
      case 'checking':
        return 'text-yellow-500'
      case 'connected':
        return 'text-green-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className={`text-lg font-semibold ${getStatusColor()}`}>
          Verificando conexão com o banco de dados...
        </div>
      </div>
    )
  }

  if (connection.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-500 font-semibold mb-2">Erro na conexão:</p>
        <p className="text-red-700">{connection.error}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Detalhes técnicos:</p>
          <ul className="list-disc list-inside text-sm text-gray-500">
            <li>URL da API: {import.meta.env.VITE_SUPABASE_URL}</li>
            <li>Status: {connection.status}</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className={`text-lg font-semibold ${getStatusColor()} mb-4`}>
        Status: {connection.status === 'connected' ? 'Conectado com sucesso!' : 'Verificando conexão...'}
      </div>
      
      {produtos.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-3">Produtos carregados:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map((produto) => (
              <div key={produto.id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-semibold">{produto.nome}</h3>
                <p className="text-gray-600">{produto.descricao}</p>
                <p className="text-green-600 font-medium">
                  R$ {produto.preco.toFixed(2)}
                </p>
                {produto.imagem_url && (
                  <img
                    src={produto.imagem_url}
                    alt={produto.nome}
                    className="mt-2 w-full h-40 object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Nenhum produto encontrado no banco de dados.</p>
      )}
    </div>
  )
}
