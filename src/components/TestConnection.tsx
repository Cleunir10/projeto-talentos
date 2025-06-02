import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Produto {
  id: number
  nome: string
  descricao: string | null
  preco: number
  imagem_url: string | null
}

export const TestConnection: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        // Teste de conectividade básica
        const response = await fetch('https://rftmgmpxcnkkheyrxzwa.supabase.co/rest/v1/health')
        console.log('Status da API Supabase:', response.status)
        
        // Tenta buscar os produtos
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
        
        if (error) {
          console.error('Erro Supabase:', error)
          setError(`Erro ao conectar com o Supabase: ${error.message}\nDetalhes: ${error.details}`)
          return
        }
        
        console.log('Dados recebidos:', data)
        setProdutos(data || [])
      } catch (err) {
        console.error('Erro na requisição:', err)
        setError(`Erro na requisição: ${err instanceof Error ? err.message : 'Erro desconhecido'}\n\nPor favor, verifique sua conexão com a internet e tente novamente.`)
      }
    }

    fetchProdutos()
  }, [])

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Teste de Conexão com Supabase</h2>
      <div className="space-y-4">
        {produtos.map((produto) => (
          <div key={produto.id} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{produto.nome}</h3>
            <p className="text-gray-600">{produto.descricao}</p>
            <p className="text-green-600 font-bold">
              R$ {produto.preco.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
