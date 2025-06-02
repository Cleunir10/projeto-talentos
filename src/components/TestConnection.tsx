import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Estas credenciais são públicas e só têm acesso a dados públicos
const supabase = createClient(
  'https://rlfqurnrqufpkzygryue.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZnF1cm5ycXVmcGt6eWdyeXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0MDI4MTcsImV4cCI6MjAxNzk3ODgxN30.DSOB_XMkAhBLPIQFG-OFGYqGHm3XPGS6lvfW87qIHE8'
)

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
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
      
      if (error) {
        setError('Erro ao conectar com o Supabase: ' + error.message)
        return
      }
      
      setProdutos(data || [])
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
