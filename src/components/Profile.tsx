
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Star, MapPin, Phone, Mail, Save } from "lucide-react";

interface ProfileProps {
  userType: 'costureira' | 'cliente';
}

export function Profile({ userType }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: userType === 'costureira' ? 'Maria Silva' : 'Ana Costa',
    email: userType === 'costureira' ? 'maria@email.com' : 'ana@email.com',
    telefone: '(11) 99999-9999',
    endereco: 'São Paulo, SP',
    bio: userType === 'costureira' 
      ? 'Costureira apaixonada por sustentabilidade. Trabalho com reaproveitamento de tecidos há mais de 10 anos, criando peças únicas e conscientes.'
      : 'Apaixonada por moda sustentável e consumo consciente.',
    especialidades: ['Bolsas', 'Acessórios', 'Upcycling'],
    experiencia: '10 anos',
    produtosVendidos: 150,
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 45
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aqui salvaria os dados no backend
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                  {profileData.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{profileData.nome}</CardTitle>
              <CardDescription className="capitalize">
                {userType === 'costureira' ? 'Costureira Sustentável' : 'Cliente'}
              </CardDescription>
              
              {userType === 'costureira' && (
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{profileData.avaliacaoMedia}</span>
                  <span className="text-gray-500 text-sm">
                    ({profileData.totalAvaliacoes} avaliações)
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{profileData.telefone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{profileData.endereco}</span>
              </div>
              
              {userType === 'costureira' && (
                <>
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Especialidades</p>
                    <div className="flex flex-wrap gap-1">
                      {profileData.especialidades.map((esp) => (
                        <Badge key={esp} variant="secondary" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{profileData.produtosVendidos}</p>
                      <p className="text-xs text-gray-500">Produtos Vendidos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{profileData.experiencia}</p>
                      <p className="text-xs text-gray-500">Experiência</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Mantenha suas informações atualizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={profileData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={profileData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Localização</Label>
                  <Input
                    id="endereco"
                    value={profileData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {userType === 'costureira' ? 'Sobre mim e meu trabalho' : 'Sobre mim'}
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder={userType === 'costureira' 
                    ? 'Conte sobre sua experiência, especialidades e paixão pela sustentabilidade...'
                    : 'Conte um pouco sobre você...'
                  }
                />
              </div>

              {userType === 'costureira' && (
                <div className="space-y-2">
                  <Label htmlFor="experiencia">Anos de Experiência</Label>
                  <Input
                    id="experiencia"
                    value={profileData.experiencia}
                    onChange={(e) => handleInputChange('experiencia', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Ex: 5 anos"
                  />
                </div>
              )}

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics for Costureira */}
          {userType === 'costureira' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>
                  Acompanhe seu desempenho na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{profileData.produtosVendidos}</p>
                    <p className="text-sm text-gray-500">Produtos Vendidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{profileData.avaliacaoMedia}</p>
                    <p className="text-sm text-gray-500">Avaliação Média</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{profileData.totalAvaliacoes}</p>
                    <p className="text-sm text-gray-500">Total de Avaliações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
