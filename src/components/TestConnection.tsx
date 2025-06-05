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
        setIsLoading(true);
        setConnectionStatus('checking');
        setError(null);

        console.log('Iniciando teste de conexão...');
        
        // Verificar a conexão e contar produtos
        const { count, error: countError } = await supabase
          .from('produtos')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.error('Erro de conexão:', countError);
          console.error('Detalhes do erro:', {
            code: countError.code,
            hint: countError.hint,
            details: countError.details,
            message: countError.message
          });
          setConnectionStatus('failed');
          setError(`Erro de conexão: ${countError.message}. Código: ${countError.code}`);
          return;
        }

        console.log('Conexão estabelecida, contagem de produtos:', count);
        setConnectionStatus('connected');

        // Buscar os produtos
        const { data: produtos, error: productsError } = await supabase
          .from('produtos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (productsError) {
          console.error('Erro ao buscar produtos:', productsError);
          setError(`Erro ao buscar produtos: ${productsError.message}`);
          return;
        }

        console.log('Produtos carregados:', produtos?.length || 0);
        setProdutos(produtos || []);
        setError(null);
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Erro inesperado ao conectar com o banco de dados');
        setConnectionStatus('failed');
      } finally {
        setIsLoading(false);
      }
    };

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
