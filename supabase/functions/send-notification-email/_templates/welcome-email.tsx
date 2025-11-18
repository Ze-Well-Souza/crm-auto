import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

export interface WelcomeEmailProps {
  userName: string;
  planName: string;
  planDisplayName: string;
  planLimits: {
    clients: number;
    appointments: number;
    serviceOrders: number;
    users: number;
  };
  features: string[];
}

export const WelcomeEmail = ({
  userName,
  planName,
  planDisplayName,
  planLimits,
  features = [],
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo ao CRM Auto! Seu plano {planDisplayName} está ativo.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Bem-vindo ao CRM Auto!</Heading>
        
        <Text style={text}>
          Olá, <strong>{userName}</strong>!
        </Text>
        
        <Text style={text}>
          Estamos muito felizes em tê-lo conosco! Sua conta foi criada com sucesso e você já pode começar a usar o CRM Auto.
        </Text>

        <Section style={planBox}>
          <Text style={planTitle}>📦 Seu Plano: {planDisplayName}</Text>
          
          <Text style={planDetail}>
            Você está no plano <strong>{planDisplayName}</strong> com os seguintes limites:
          </Text>

          <Section style={limitsBox}>
            <Text style={limitItem}>
              👥 <strong>Clientes:</strong> {planLimits.clients === -1 ? 'Ilimitado' : planLimits.clients}
            </Text>
            <Text style={limitItem}>
              📅 <strong>Agendamentos:</strong> {planLimits.appointments === -1 ? 'Ilimitado' : planLimits.appointments}
            </Text>
            <Text style={limitItem}>
              🔧 <strong>Ordens de Serviço:</strong> {planLimits.serviceOrders === -1 ? 'Ilimitado' : planLimits.serviceOrders}
            </Text>
            <Text style={limitItem}>
              👤 <strong>Usuários:</strong> {planLimits.users === -1 ? 'Ilimitado' : planLimits.users}
            </Text>
          </Section>

          {features.length > 0 && (
            <>
              <Text style={planDetail}>
                <strong>Recursos incluídos:</strong>
              </Text>
              <Section style={featuresBox}>
                {features.map((feature, index) => (
                  <Text key={index} style={featureItem}>
                    ✓ {feature}
                  </Text>
                ))}
              </Section>
            </>
          )}
        </Section>

        <Hr style={divider} />

        <Section style={stepsSection}>
          <Text style={stepsTitle}>🚀 Primeiros Passos</Text>
          
          <Text style={stepItem}>
            <strong>1. Complete seu perfil</strong><br />
            Adicione suas informações pessoais e da empresa para personalizar sua experiência.
          </Text>
          
          <Text style={stepItem}>
            <strong>2. Cadastre seus primeiros clientes</strong><br />
            Comece adicionando os clientes que você já atende para centralizar todas as informações.
          </Text>
          
          <Text style={stepItem}>
            <strong>3. Configure seus serviços</strong><br />
            Cadastre os tipos de serviços que você oferece e os preços praticados.
          </Text>
          
          <Text style={stepItem}>
            <strong>4. Crie seu primeiro agendamento</strong><br />
            Organize a agenda dos seus clientes e receba lembretes automáticos.
          </Text>
          
          <Text style={stepItem}>
            <strong>5. Gerencie seu estoque</strong><br />
            Cadastre peças e mantenha controle do seu inventário em tempo real.
          </Text>
        </Section>

        <Hr style={divider} />

        <Section style={tipsSection}>
          <Text style={tipsTitle}>💡 Dicas Importantes</Text>
          
          <Text style={tipItem}>
            • <strong>Notificações por Email:</strong> Seus clientes receberão emails automáticos de confirmação de agendamentos e pagamentos.
          </Text>
          
          <Text style={tipItem}>
            • <strong>Lembretes Automáticos:</strong> Seus clientes serão lembrados 24h antes dos agendamentos.
          </Text>
          
          <Text style={tipItem}>
            • <strong>Relatórios Financeiros:</strong> Acompanhe suas receitas e despesas em tempo real.
          </Text>
          
          <Text style={tipItem}>
            • <strong>Backup Automático:</strong> Todos os seus dados estão seguros e com backup automático.
          </Text>
        </Section>

        {planName === 'free' && (
          <Section style={upgradeBox}>
            <Text style={upgradeText}>
              💎 <strong>Quer crescer ainda mais?</strong><br />
              Confira nossos planos pagos para ter acesso a recursos avançados como relatórios personalizados, integrações e suporte prioritário.
            </Text>
          </Section>
        )}

        <Text style={footer}>
          Precisando de ajuda? Estamos aqui para você!<br />
          Entre em contato através do suporte sempre que precisar.
          <br /><br />
          <strong>Equipe CRM Auto</strong><br />
          Simplificando a gestão da sua oficina
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const planBox = {
  backgroundColor: '#f0f7ff',
  borderRadius: '12px',
  padding: '24px 40px',
  margin: '24px 40px',
  border: '2px solid #3b82f6',
};

const planTitle = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const planDetail = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '12px 0',
  padding: '0',
};

const limitsBox = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
  border: '1px solid #dbeafe',
};

const limitItem = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
  padding: '0',
};

const featuresBox = {
  margin: '12px 0',
};

const featureItem = {
  color: '#059669',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '6px 0',
  padding: '0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
};

const stepsSection = {
  padding: '0 40px',
  margin: '24px 0',
};

const stepsTitle = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  padding: '0',
};

const stepItem = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0',
};

const tipsSection = {
  backgroundColor: '#fffbeb',
  borderRadius: '12px',
  padding: '24px 40px',
  margin: '24px 40px',
  border: '1px solid #fbbf24',
};

const tipsTitle = {
  color: '#92400e',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  padding: '0',
};

const tipItem = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '12px 0',
  padding: '0',
};

const upgradeBox = {
  backgroundColor: '#faf5ff',
  borderRadius: '12px',
  padding: '20px 40px',
  margin: '24px 40px',
  border: '2px solid #a855f7',
};

const upgradeText = {
  color: '#6b21a8',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  padding: '0',
  textAlign: 'center' as const,
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 0 0 0',
  padding: '0 40px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
  paddingTop: '32px',
};
