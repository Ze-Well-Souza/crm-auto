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

export interface ReactivationEmailProps {
  clientName: string;
  daysSinceLastAppointment: number;
  lastAppointmentDate: string;
  lastServiceType?: string;
  partnerName?: string;
}

export const ReactivationEmail = ({
  clientName,
  daysSinceLastAppointment,
  lastAppointmentDate,
  lastServiceType,
  partnerName,
}: ReactivationEmailProps) => (
  <Html>
    <Head />
    <Preview>Sentimos sua falta! Que tal agendar sua próxima revisão?</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>💙 Sentimos sua Falta!</Heading>
        
        <Text style={text}>
          Olá, <strong>{clientName}</strong>!
        </Text>
        
        <Text style={text}>
          Percebemos que faz <strong>{daysSinceLastAppointment} dias</strong> desde seu último atendimento conosco.
        </Text>

        <Section style={lastVisitBox}>
          <Text style={lastVisitTitle}>📅 Seu Último Atendimento</Text>
          <Text style={lastVisitDetail}>
            <strong>Data:</strong> {lastAppointmentDate}
          </Text>
          {lastServiceType && (
            <Text style={lastVisitDetail}>
              <strong>Serviço:</strong> {lastServiceType}
            </Text>
          )}
        </Section>

        <Text style={text}>
          Seu veículo pode estar precisando de manutenção! Manter a revisão em dia é fundamental para:
        </Text>

        <Section style={benefitsBox}>
          <Text style={benefitItem}>
            ✓ <strong>Segurança:</strong> Prevenir problemas mecânicos e garantir viagens tranquilas
          </Text>
          <Text style={benefitItem}>
            ✓ <strong>Economia:</strong> Evitar reparos caros detectando problemas cedo
          </Text>
          <Text style={benefitItem}>
            ✓ <strong>Valorização:</strong> Manter o valor de revenda do seu veículo
          </Text>
          <Text style={benefitItem}>
            ✓ <strong>Desempenho:</strong> Garantir eficiência de combustível e performance
          </Text>
        </Section>

        <Hr style={divider} />

        <Section style={offerSection}>
          <Text style={offerTitle}>🎁 Oferta Especial de Retorno</Text>
          <Text style={offerText}>
            Para receber você de volta, estamos oferecendo <strong>condições especiais</strong> para o seu próximo agendamento!
          </Text>
          <Text style={offerText}>
            Entre em contato conosco e mencione este email para garantir seu desconto.
          </Text>
        </Section>

        <Hr style={divider} />

        <Section style={servicesSection}>
          <Text style={servicesTitle}>🔧 Principais Serviços</Text>
          
          <Text style={serviceItem}>
            <strong>Revisão Completa</strong><br />
            Verificação detalhada de todos os sistemas do veículo
          </Text>
          
          <Text style={serviceItem}>
            <strong>Troca de Óleo e Filtros</strong><br />
            Manutenção preventiva essencial para longevidade do motor
          </Text>
          
          <Text style={serviceItem}>
            <strong>Alinhamento e Balanceamento</strong><br />
            Para melhor dirigibilidade e economia de combustível
          </Text>
          
          <Text style={serviceItem}>
            <strong>Sistema de Freios</strong><br />
            Inspeção e manutenção para sua segurança
          </Text>
        </Section>

        <Hr style={divider} />

        <Section style={ctaSection}>
          <Text style={ctaTitle}>📞 Entre em Contato</Text>
          <Text style={ctaText}>
            Nossa equipe está pronta para atendê-lo!<br />
            Agende seu horário e volte a contar com nosso serviço de qualidade.
          </Text>
          <Text style={ctaText}>
            <strong>Estamos aguardando seu retorno!</strong>
          </Text>
        </Section>

        <Text style={footer}>
          {partnerName && (
            <>
              <strong>{partnerName}</strong><br />
            </>
          )}
          Cuidando do seu veículo com excelência
          <br /><br />
          <span style={footerSmall}>
            Você recebeu este email porque é nosso cliente. Se não deseja mais receber emails de reativação, entre em contato conosco.
          </span>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ReactivationEmail;

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
  color: '#1e40af',
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

const lastVisitBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  padding: '20px 40px',
  margin: '24px 40px',
  border: '1px solid #e2e8f0',
};

const lastVisitTitle = {
  color: '#475569',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  padding: '0',
};

const lastVisitDetail = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
  padding: '0',
};

const benefitsBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '12px',
  padding: '20px 40px',
  margin: '24px 40px',
  border: '1px solid #86efac',
};

const benefitItem = {
  color: '#166534',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '12px 0',
  padding: '0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
};

const offerSection = {
  backgroundColor: '#fef3c7',
  borderRadius: '12px',
  padding: '24px 40px',
  margin: '24px 40px',
  border: '2px solid #fbbf24',
};

const offerTitle = {
  color: '#92400e',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const offerText = {
  color: '#78350f',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '12px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const servicesSection = {
  padding: '0 40px',
  margin: '24px 0',
};

const servicesTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  padding: '0',
};

const serviceItem = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0',
  borderLeft: '3px solid #3b82f6',
  paddingLeft: '16px',
};

const ctaSection = {
  backgroundColor: '#dbeafe',
  borderRadius: '12px',
  padding: '24px 40px',
  margin: '24px 40px',
  border: '1px solid #3b82f6',
};

const ctaTitle = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const ctaText = {
  color: '#1e3a8a',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '12px 0',
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

const footerSmall = {
  fontSize: '12px',
  color: '#9ca3af',
};
