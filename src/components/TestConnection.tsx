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
        console.log('Iniciando busca de produtos...')
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
        
        if (error) {
          console.error('Erro Supabase:', error)
          setError(`Erro ao buscar produtos: ${error.message}`)
          return
        }
        
        console.log('Produtos encontrados:', data?.length || 0)
        setProdutos(data || [])
      } catch (err) {
        console.error('Erro na requisição:', err)
        setError('Erro ao conectar com o banco de dados. Por favor, tente novamente mais tarde.')
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
