# Exemplos de Código - Endpoints de Autenticação

Este documento contém exemplos práticos de como usar os endpoints de autenticação em diferentes linguagens e cenários.

---

## Índice

1. [JavaScript/Node.js](#javascriptnodejs)
2. [Python](#python)
3. [PHP](#php)
4. [cURL](#curl)
5. [Postman Collection](#postman-collection)
6. [Fluxos Completos](#fluxos-completos)

---

## JavaScript/Node.js

### Cliente de Autenticação

```javascript
// auth-client.js
class CRMAuthClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.accessToken = null;
    this.refreshToken = null;
  }

  async register(email, password, fullName) {
    const response = await fetch(`${this.baseUrl}/auth-v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message);
    }

    return data.data;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/auth-v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message);
    }

    // Armazenar tokens
    this.accessToken = data.data.access_token;
    this.refreshToken = data.data.refresh_token;

    // Salvar no localStorage (se navegador)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('access_token', this.accessToken);
      localStorage.setItem('refresh_token', this.refreshToken);
    }

    return data.data;
  }

  async refresh() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/auth-v1/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: this.refreshToken,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message);
    }

    // Atualizar tokens
    this.accessToken = data.data.access_token;
    this.refreshToken = data.data.refresh_token;

    // Atualizar localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('access_token', this.accessToken);
      localStorage.setItem('refresh_token', this.refreshToken);
    }

    return data.data;
  }

  async logout() {
    const response = await fetch(`${this.baseUrl}/auth-v1/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    const data = await response.json();

    // Limpar tokens
    this.accessToken = null;
    this.refreshToken = null;

    // Limpar localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    return data;
  }

  async getMe() {
    const response = await fetch(`${this.baseUrl}/auth-v1/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      // Se token expirou, tentar refresh
      if (data.error.code === 'INVALID_TOKEN' && this.refreshToken) {
        await this.refresh();
        return this.getMe(); // Retry
      }
      throw new Error(data.error.message);
    }

    return data.data;
  }

  async generateApiKey(name, permissions) {
    const response = await fetch(`${this.baseUrl}/auth-v1/api-keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        permissions,
        rate_limit_per_minute: 100,
        rate_limit_per_day: 50000,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message);
    }

    return data.data;
  }

  async forgotPassword(email) {
    const response = await fetch(`${this.baseUrl}/auth-v1/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  }

  async resetPassword(token, newPassword) {
    const response = await fetch(`${this.baseUrl}/auth-v1/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        new_password: newPassword,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message);
    }

    return data.data;
  }
}

// Uso
const client = new CRMAuthClient('https://simqszeoovjipujuxeus.supabase.co/functions/v1');

// Registrar
try {
  const user = await client.register('user@example.com', 'SecurePass123!', 'João Silva');
  console.log('Registered:', user);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login
try {
  const session = await client.login('user@example.com', 'SecurePass123!');
  console.log('Logged in:', session);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Obter dados do usuário
try {
  const me = await client.getMe();
  console.log('Current user:', me);
} catch (error) {
  console.error('Failed to get user:', error.message);
}

// Gerar API Key
try {
  const apiKey = await client.generateApiKey('Production', {
    read: ['*'],
    write: ['clients', 'vehicles'],
    delete: [],
  });
  console.log('API Key:', apiKey.key); // Salvar isso!
} catch (error) {
  console.error('Failed to generate API key:', error.message);
}
```

### Interceptor Axios com Refresh Automático

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://simqszeoovjipujuxeus.supabase.co/functions/v1',
});

// Request interceptor - adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se token expirou e ainda não tentamos refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        const response = await axios.post(
          'https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/refresh',
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: newRefreshToken } = response.data.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou, redirecionar para login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Uso
import api from './api';

// Fazer requisições normalmente
const clients = await api.get('/api/v1/clients');
console.log(clients.data);

// O refresh é automático se o token expirar!
```

---

## Python

### Cliente de Autenticação

```python
import requests
from typing import Optional, Dict
import json

class CRMAuthClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = None
        self.session = requests.Session()

    def register(self, email: str, password: str, full_name: str = None) -> Dict:
        """Registrar novo usuário"""
        response = self.session.post(
            f"{self.base_url}/auth-v1/register",
            json={
                "email": email,
                "password": password,
                "full_name": full_name,
            }
        )

        data = response.json()

        if not data.get("success"):
            raise Exception(data["error"]["message"])

        return data["data"]

    def login(self, email: str, password: str) -> Dict:
        """Fazer login"""
        response = self.session.post(
            f"{self.base_url}/auth-v1/login",
            json={
                "email": email,
                "password": password,
            }
        )

        data = response.json()

        if not data.get("success"):
            raise Exception(data["error"]["message"])

        # Armazenar tokens
        self.access_token = data["data"]["access_token"]
        self.refresh_token = data["data"]["refresh_token"]

        # Configurar header padrão
        self.session.headers.update({
            "Authorization": f"Bearer {self.access_token}"
        })

        return data["data"]

    def refresh(self) -> Dict:
        """Renovar access token"""
        if not self.refresh_token:
            raise Exception("No refresh token available")

        response = self.session.post(
            f"{self.base_url}/auth-v1/refresh",
            json={"refresh_token": self.refresh_token}
        )

        data = response.json()

        if not data.get("success"):
            raise Exception(data["error"]["message"])

        # Atualizar tokens
        self.access_token = data["data"]["access_token"]
        self.refresh_token = data["data"]["refresh_token"]

        # Atualizar header
        self.session.headers.update({
            "Authorization": f"Bearer {self.access_token}"
        })

        return data["data"]

    def logout(self) -> Dict:
        """Fazer logout"""
        response = self.session.post(f"{self.base_url}/auth-v1/logout")

        # Limpar tokens
        self.access_token = None
        self.refresh_token = None
        self.session.headers.pop("Authorization", None)

        return response.json()

    def get_me(self) -> Dict:
        """Obter dados do usuário atual"""
        response = self.session.get(f"{self.base_url}/auth-v1/me")

        data = response.json()

        if not data.get("success"):
            # Tentar refresh se token expirou
            if data["error"]["code"] == "INVALID_TOKEN" and self.refresh_token:
                self.refresh()
                return self.get_me()  # Retry
            raise Exception(data["error"]["message"])

        return data["data"]

    def generate_api_key(self, name: str, permissions: Dict) -> Dict:
        """Gerar API Key"""
        response = self.session.post(
            f"{self.base_url}/auth-v1/api-keys",
            json={
                "name": name,
                "permissions": permissions,
                "rate_limit_per_minute": 100,
                "rate_limit_per_day": 50000,
            }
        )

        data = response.json()

        if not data.get("success"):
            raise Exception(data["error"]["message"])

        return data["data"]

    def forgot_password(self, email: str) -> Dict:
        """Solicitar reset de senha"""
        response = self.session.post(
            f"{self.base_url}/auth-v1/forgot-password",
            json={"email": email}
        )

        return response.json()

    def reset_password(self, token: str, new_password: str) -> Dict:
        """Resetar senha"""
        response = self.session.post(
            f"{self.base_url}/auth-v1/reset-password",
            json={
                "token": token,
                "new_password": new_password,
            }
        )

        data = response.json()

        if not data.get("success"):
            raise Exception(data["error"]["message"])

        return data["data"]


# Uso
if __name__ == "__main__":
    client = CRMAuthClient("https://simqszeoovjipujuxeus.supabase.co/functions/v1")

    # Registrar
    try:
        user = client.register("user@example.com", "SecurePass123!", "João Silva")
        print(f"Registered: {user}")
    except Exception as e:
        print(f"Registration failed: {e}")

    # Login
    try:
        session = client.login("user@example.com", "SecurePass123!")
        print(f"Logged in: {session}")
    except Exception as e:
        print(f"Login failed: {e}")

    # Obter dados do usuário
    try:
        me = client.get_me()
        print(f"Current user: {me}")
    except Exception as e:
        print(f"Failed to get user: {e}")

    # Gerar API Key
    try:
        api_key = client.generate_api_key("Production", {
            "read": ["*"],
            "write": ["clients", "vehicles"],
            "delete": [],
        })
        print(f"API Key: {api_key['key']}")  # Salvar isso!
    except Exception as e:
        print(f"Failed to generate API key: {e}")
```

---

## PHP

### Cliente de Autenticação

```php
<?php

class CRMAuthClient {
    private $baseUrl;
    private $accessToken;
    private $refreshToken;

    public function __construct($baseUrl) {
        $this->baseUrl = $baseUrl;
    }

    public function register($email, $password, $fullName = null) {
        $data = [
            'email' => $email,
            'password' => $password,
            'full_name' => $fullName,
        ];

        $response = $this->request('POST', '/auth-v1/register', $data);

        if (!$response['success']) {
            throw new Exception($response['error']['message']);
        }

        return $response['data'];
    }

    public function login($email, $password) {
        $data = [
            'email' => $email,
            'password' => $password,
        ];

        $response = $this->request('POST', '/auth-v1/login', $data);

        if (!$response['success']) {
            throw new Exception($response['error']['message']);
        }

        // Armazenar tokens
        $this->accessToken = $response['data']['access_token'];
        $this->refreshToken = $response['data']['refresh_token'];

        return $response['data'];
    }

    public function refresh() {
        if (!$this->refreshToken) {
            throw new Exception('No refresh token available');
        }

        $data = ['refresh_token' => $this->refreshToken];

        $response = $this->request('POST', '/auth-v1/refresh', $data);

        if (!$response['success']) {
            throw new Exception($response['error']['message']);
        }

        // Atualizar tokens
        $this->accessToken = $response['data']['access_token'];
        $this->refreshToken = $response['data']['refresh_token'];

        return $response['data'];
    }

    public function logout() {
        $response = $this->request('POST', '/auth-v1/logout');

        // Limpar tokens
        $this->accessToken = null;
        $this->refreshToken = null;

        return $response;
    }

    public function getMe() {
        $response = $this->request('GET', '/auth-v1/me');

        if (!$response['success']) {
            // Tentar refresh se token expirou
            if ($response['error']['code'] === 'INVALID_TOKEN' && $this->refreshToken) {
                $this->refresh();
                return $this->getMe(); // Retry
            }
            throw new Exception($response['error']['message']);
        }

        return $response['data'];
    }

    public function generateApiKey($name, $permissions) {
        $data = [
            'name' => $name,
            'permissions' => $permissions,
            'rate_limit_per_minute' => 100,
            'rate_limit_per_day' => 50000,
        ];

        $response = $this->request('POST', '/auth-v1/api-keys', $data);

        if (!$response['success']) {
            throw new Exception($response['error']['message']);
        }

        return $response['data'];
    }

    public function forgotPassword($email) {
        $data = ['email' => $email];
        return $this->request('POST', '/auth-v1/forgot-password', $data);
    }

    public function resetPassword($token, $newPassword) {
        $data = [
            'token' => $token,
            'new_password' => $newPassword,
        ];

        $response = $this->request('POST', '/auth-v1/reset-password', $data);

        if (!$response['success']) {
            throw new Exception($response['error']['message']);
        }

        return $response['data'];
    }

    private function request($method, $endpoint, $data = null) {
        $url = $this->baseUrl . $endpoint;

        $headers = [
            'Content-Type: application/json',
        ];

        if ($this->accessToken) {
            $headers[] = 'Authorization: Bearer ' . $this->accessToken;
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return json_decode($response, true);
    }
}

// Uso
$client = new CRMAuthClient('https://simqszeoovjipujuxeus.supabase.co/functions/v1');

// Login
try {
    $session = $client->login('user@example.com', 'SecurePass123!');
    echo "Logged in: " . json_encode($session) . "\n";
} catch (Exception $e) {
    echo "Login failed: " . $e->getMessage() . "\n";
}

// Obter dados do usuário
try {
    $me = $client->getMe();
    echo "Current user: " . json_encode($me) . "\n";
} catch (Exception $e) {
    echo "Failed to get user: " . $e->getMessage() . "\n";
}
?>
```

---

## cURL

### Exemplos Completos

```bash
# 1. Registrar novo usuário
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "full_name": "João Silva"
  }'

# 2. Login
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }' \
  | jq -r '.data.access_token' > access_token.txt

# 3. Obter dados do usuário
curl -X GET https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/me \
  -H "Authorization: Bearer $(cat access_token.txt)"

# 4. Gerar API Key
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/api-keys \
  -H "Authorization: Bearer $(cat access_token.txt)" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Key",
    "permissions": {
      "read": ["*"],
      "write": ["clients", "vehicles"],
      "delete": []
    }
  }' \
  | jq -r '.data.key' > api_key.txt

# 5. Usar API Key
curl -X GET https://simqszeoovjipujuxeus.supabase.co/functions/v1/api/v1/clients \
  -H "Authorization: Bearer $(cat api_key.txt)"

# 6. Refresh token
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'

# 7. Logout
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/logout \
  -H "Authorization: Bearer $(cat access_token.txt)"

# 8. Forgot Password
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'

# 9. Reset Password
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "RESET_TOKEN_FROM_EMAIL",
    "new_password": "NewSecurePass123!"
  }'
```

---

## Fluxos Completos

### Fluxo 1: Do Zero ao API Key

```bash
#!/bin/bash

BASE_URL="https://simqszeoovjipujuxeus.supabase.co/functions/v1"

# 1. Registrar
echo "1. Registrando usuário..."
curl -X POST $BASE_URL/auth-v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "SecurePass123!",
    "full_name": "Usuário Teste"
  }'

# 2. Login
echo -e "\n\n2. Fazendo login..."
ACCESS_TOKEN=$(curl -X POST $BASE_URL/auth-v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "SecurePass123!"
  }' | jq -r '.data.access_token')

echo "Access Token: $ACCESS_TOKEN"

# 3. Obter dados do usuário
echo -e "\n\n3. Obtendo dados do usuário..."
curl -X GET $BASE_URL/auth-v1/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 4. Gerar API Key
echo -e "\n\n4. Gerando API Key..."
API_KEY=$(curl -X POST $BASE_URL/auth-v1/api-keys \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chave de Produção",
    "permissions": {
      "read": ["*"],
      "write": ["clients", "vehicles"],
      "delete": []
    }
  }' | jq -r '.data.key')

echo "API Key: $API_KEY"
echo "⚠️  IMPORTANTE: Salve esta chave, ela não será mostrada novamente!"

# 5. Testar API Key
echo -e "\n\n5. Testando API Key..."
curl -X GET $BASE_URL/api-test \
  -H "Authorization: Bearer $API_KEY"

echo -e "\n\n✅ Fluxo completo executado com sucesso!"
```

### Fluxo 2: Refresh Automático

```javascript
// auto-refresh.js
async function fetchWithAutoRefresh(url, options = {}) {
  let accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // Primeira tentativa
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // Se token expirou
  if (response.status === 401) {
    // Tentar refresh
    const refreshResponse = await fetch(
      'https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/refresh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      accessToken = refreshData.data.access_token;

      // Salvar novo token
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshData.data.refresh_token);

      // Retry requisição original
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } else {
      // Refresh falhou, redirecionar para login
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  return response;
}

// Uso
const response = await fetchWithAutoRefresh('https://simqszeoovjipujuxeus.supabase.co/functions/v1/api/v1/clients');
const data = await response.json();
console.log(data);
```

---

## Tratamento de Erros

### Todos os Possíveis Erros

```javascript
async function handleApiError(error) {
  const errorCode = error.response?.data?.error?.code;

  switch (errorCode) {
    case 'UNAUTHORIZED':
      // Token inválido ou ausente
      console.error('Por favor, faça login novamente');
      window.location.href = '/login';
      break;

    case 'INVALID_CREDENTIALS':
      // Email ou senha incorretos
      console.error('Email ou senha incorretos');
      break;

    case 'ACCOUNT_LOCKED':
      // Conta bloqueada por tentativas
      console.error('Sua conta foi bloqueada temporariamente por excesso de tentativas. Tente novamente em 15 minutos.');
      break;

    case 'RATE_LIMIT_EXCEEDED':
      // Muitas tentativas
      const resetAt = error.response?.data?.error?.details?.resetAt;
      console.error(`Muitas tentativas. Tente novamente em ${resetAt}`);
      break;

    case 'WEAK_PASSWORD':
      // Senha fraca
      console.error('Senha muito fraca. Use pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números.');
      break;

    case 'EMAIL_ALREADY_EXISTS':
      // Email já cadastrado
      console.error('Este email já está cadastrado. Faça login ou recupere sua senha.');
      break;

    case 'INVALID_TOKEN':
      // Token inválido/expirado
      console.error('Sessão expirada. Fazendo login novamente...');
      // Tentar refresh automático
      break;

    case 'EMAIL_NOT_VERIFIED':
      // Email não verificado
      console.error('Por favor, verifique seu email antes de continuar.');
      break;

    case 'VALIDATION_ERROR':
      // Erro de validação
      const details = error.response?.data?.error?.details;
      console.error('Erros de validação:', details);
      break;

    default:
      console.error('Erro desconhecido:', error.message);
  }
}

// Uso
try {
  await client.login(email, password);
} catch (error) {
  handleApiError(error);
}
```

---

## Conclusão

Estes exemplos cobrem os casos de uso mais comuns. Para mais informações, consulte:

- `PLANO_AUTH_ENDPOINTS.md` - Plano completo
- `AUTH_ENDPOINTS_RESUMO.md` - Resumo executivo
- `API_STRUCTURE_README.md` - Documentação geral da API

**Última Atualização:** 26/12/2025
