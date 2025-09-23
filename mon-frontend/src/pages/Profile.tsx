import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, authFetch, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      console.log(user)
      setProfile({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Appel API pour mettre à jour le profil
      const response = await authFetch(" http://localhost:8000/api/profile/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: profile.firstname,
          lastname: profile.lastname,
          phone: profile.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour");
      }

      const updatedUser = await response.json();

      // Mettre à jour la session courante avec la réponse du backend
      setUser(updatedUser);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Vous devez être connecté pour accéder à votre profil.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

 if (user){
   return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('-1/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Vos informations de base et coordonnées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    value={profile.firstname}
                    onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    value={profile.lastname}
                    onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  L'email ne peut pas être modifié ici. Contactez le support si nécessaire.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Settings className="h-4 w-4" />
                    Modifier mes informations
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleUpdateProfile} 
                      disabled={loading}
                      className="gap-2"
                    >
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informations du compte */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>
                Détails de votre compte et préférences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Type de compte</p>
                  <p className="text-sm text-muted-foreground">Client</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Date d'inscription</p>
                  <p className="text-sm text-muted-foreground">
                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Points de fidélité</p>
                  <p className="text-sm text-muted-foreground">
                    {user.loyaltyPoints || 0} points
                  </p>
                </div>
              </div>

              <Separator />

              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                className="w-full"
              >
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
 };
};

export default Profile;