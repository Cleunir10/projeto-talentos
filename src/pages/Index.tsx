import * as React from 'react'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/auth-context'
import { LoginModal } from '../components/LoginModal'
import { RegisterModal } from '../components/RegisterModal'

export function Index() {
  const { user, signOut } = useAuth()
  const [showLoginModal, setShowLoginModal] = React.useState(false)
  const [showRegisterModal, setShowRegisterModal] = React.useState(false)
  const [userType, setUserType] = React.useState<'costureira' | 'cliente'>('cliente')

  const handleLoginClick = (type: 'costureira' | 'cliente') => {
    setUserType(type)
    setShowLoginModal(true)
  }

  const handleRegisterClick = (type: 'costureira' | 'cliente') => {
    setUserType(type)
    setShowRegisterModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Talentos</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm">Olá, {user.user_metadata.name}</span>
                <Button variant="outline" onClick={() => signOut()}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleLoginClick('cliente')}>
                  Entrar como Cliente
                </Button>
                <Button variant="outline" onClick={() => handleLoginClick('costureira')}>
                  Entrar como Costureira
                </Button>
                <Button onClick={() => handleRegisterClick('cliente')}>
                  Cadastrar como Cliente
                </Button>
                <Button onClick={() => handleRegisterClick('costureira')}>
                  Cadastrar como Costureira
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">
            Bem-vindo ao Talentos
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Conectando costureiras talentosas a clientes que valorizam qualidade e estilo
          </p>
          {!user && (
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => handleRegisterClick('cliente')}>
                Começar como Cliente
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleRegisterClick('costureira')}>
                Começar como Costureira
              </Button>
            </div>
          )}
        </div>
      </main>

      <LoginModal />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        userType={userType}
      />
    </div>
  )
}
