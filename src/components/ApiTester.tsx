
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Send, FileJson, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const ApiTester = () => {
  const { toast } = useToast();
  const [endpoint, setEndpoint] = useState('/api/session');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Función para simular la llamada a la API
  const testApi = async () => {
    if (!key) {
      toast({
        title: "Error",
        description: "Ingresa una clave API válida",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResponse('');
    
    try {
      // Simulación de respuesta - en implementación real, esto sería un fetch a tu API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulamos las diferentes respuestas según el endpoint
      let mockResponse;
      
      if (endpoint === '/api/session') {
        mockResponse = {
          success: true,
          sessionId: `sess_${Math.random().toString(36).substring(2, 15)}`,
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          message: "Sesión creada correctamente"
        };
      } else if (endpoint === '/api/validate') {
        mockResponse = {
          success: true,
          valid: true,
          sessionData: {
            userId: "usr_12345",
            permissions: ["read", "write"],
            styleConfig: {
              theme: "light",
              primaryColor: "#1a73e8",
              fontFamily: "Roboto"
            }
          },
          message: "Sesión válida"
        };
      } else {
        mockResponse = {
          success: false,
          error: "Endpoint no válido",
          message: "El endpoint solicitado no existe"
        };
      }
      
      setResponse(JSON.stringify(mockResponse, null, 2));
      
      toast({
        title: "Solicitud completada",
        description: "Respuesta recibida correctamente",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error en la solicitud",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive"
      });
      
      setResponse(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Probador de API</CardTitle>
          <CardDescription>
            Prueba los diferentes endpoints de la API de sesiones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Endpoint
            </label>
            <Tabs defaultValue="/api/session" onValueChange={setEndpoint}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="/api/session">Crear Sesión</TabsTrigger>
                <TabsTrigger value="/api/validate">Validar Sesión</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              {endpoint === '/api/session' ? 'Clave API' : 'ID de Sesión'}
            </label>
            <Input
              id="apiKey"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={endpoint === '/api/session' ? "Ingresa tu clave API" : "Ingresa el ID de sesión"}
              className="font-mono"
            />
          </div>

          <Button 
            className="w-full"
            onClick={testApi} 
            disabled={loading || !key}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando solicitud...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar {endpoint === '/api/session' ? 'creación' : 'validación'}
              </>
            )}
          </Button>

          {response && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Respuesta</label>
                <Badge variant="outline" className="font-mono text-xs">
                  application/json
                </Badge>
              </div>
              <Textarea
                value={response}
                readOnly
                className="font-mono text-sm h-60"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTester;
