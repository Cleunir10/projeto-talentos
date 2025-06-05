import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Produto {
  id: string
  nome: string
  descricao: string | null
  preco: number
  imagem_url: string | null
}

export const TestConnection: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true)
        setConnectionStatus('checking')
        console.log('Testando conexão com Supabase...')
        console.log('URL da API:', import.meta.env.VITE_SUPABASE_URL)
        
        // Teste de conectividade básica
        try {
          const response = await fetch(import.meta.env.VITE_SUPABASE_URL, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
            }
          })
          console.log('Teste de conectividade:', response.status)
        } catch (networkError) {
          console.error('Erro de rede:', networkError)
          setError(`Erro de rede: ${networkError.message}`)
          setConnectionStatus('failed')
          setIsLoading(false)
          return
        }
        console.log('Ambiente:', import.meta.env.MODE)
        console.log('Base URL:', import.meta.env.BASE_URL)
        
        // Teste de DNS
        try {
          const response = await fetch(import.meta.env.VITE_SUPABASE_URL)
          console.log('Teste de DNS bem sucedido:', response.status)
        } catch (dnsError) {
          console.error('Erro no teste de DNS:', dnsError)
          throw new Error(`Erro de DNS: ${dnsError.message}`)
        }
        
        // Primeiro teste: buscar a contagem de produtos        // First test: health check
        const { data: healthCheck, error: healthError } = await supabase
          .from('_health')
          .select('*')
          .limit(1)
          .single()

        if (healthError && !healthError.message.includes('nonexistent')) {
          throw new Error(`Connection health check failed: ${healthError.message}`)
        }

        // Second test: count products
        const { count, error: countError } = await supabase
          .from('produtos')
          .select('*', { count: 'exact', head: true })

        if (countError) {
          console.error('Connection test error:', countError)
          console.error('Error details:', {
            code: countError.code,
            hint: countError.hint,
            details: countError.details,
            message: countError.message
          })
          setConnectionStatus('failed')
          setError(`Connection error: ${countError.message}. Code: ${countError.code}`)
          setIsLoading(false)
          return
        }

        console.log('Conexão estabelecida, contagem de produtos:', count)
        setConnectionStatus('connected')

        // Agora vamos buscar os produtos
        const { data, error: productsError } = await supabase
          .from('produtos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (productsError) {
          console.error('Erro ao buscar produtos:', productsError)
          setError(`Erro ao buscar produtos: ${productsError.message}`)
          setIsLoading(false)
          return
        }

        console.log('Produtos carregados:', data?.length || 0)
        setProdutos(data || [])
        setError(null)
      } catch (err) {
        console.error('Erro inesperado:', err)
        setError('Erro inesperado ao conectar com o banco de dados')
        setConnectionStatus('failed')
      } finally {
        setIsLoading(false)
      }
    }

    testConnection()
  }, [])

  const getStatusColor = () => {
    switch (connectionStatus) {
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

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-500 font-semibold mb-2">Erro na conexão:</p>
        <p className="text-red-700">{error}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Detalhes técnicos:</p>
          <ul className="list-disc list-inside text-sm text-gray-500">
            <li>URL da API: {import.meta.env.VITE_SUPABASE_URL}</li>
            <li>Status: {connectionStatus}</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className={`text-lg font-semibold ${getStatusColor()} mb-4`}>
        Status: {connectionStatus === 'connected' ? 'Conectado com sucesso!' : 'Verificando conexão...'}
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
