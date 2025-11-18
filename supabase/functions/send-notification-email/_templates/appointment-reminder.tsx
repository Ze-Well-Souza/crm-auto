import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

export interface AppointmentReminderProps {
  clientName: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  vehicleInfo?: string;
  estimatedPrice?: number;
}

export const AppointmentReminder = ({
  clientName,
  appointmentDate,
  appointmentTime,
  serviceType,
  vehicleInfo,
  estimatedPrice,
}: AppointmentReminderProps) => (
  <Html>
    <Head />
    <Preview>Lembrete: Seu agendamento é amanhã!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔔 Lembrete de Agendamento</Heading>
        
        <Text style={text}>
          Olá, <strong>{clientName}</strong>!
        </Text>
        
        <Text style={text}>
          Este é um lembrete amigável de que você tem um agendamento <strong>amanhã</strong>:
        </Text>

        <Section style={detailsBox}>
          <Text style={detailLabel}>📅 Data:</Text>
          <Text style={detailValue}>{appointmentDate}</Text>

          <Text style={detailLabel}>🕐 Horário:</Text>
          <Text style={detailValue}>{appointmentTime}</Text>

          <Text style={detailLabel}>🔧 Serviço:</Text>
          <Text style={detailValue}>{serviceType}</Text>

          {vehicleInfo && (
            <>
              <Text style={detailLabel}>🚗 Veículo:</Text>
              <Text style={detailValue}>{vehicleInfo}</Text>
            </>
          )}

          {estimatedPrice && (
            <>
              <Text style={detailLabel}>💰 Valor Estimado:</Text>
              <Text style={detailValue}>
                R$ {estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </>
          )}
        </Section>

        <Text style={text}>
          <strong>⏰ Importante:</strong> Por favor, chegue com alguns minutos de antecedência.
        </Text>

        <Text style={text}>
          Caso precise remarcar ou cancelar, entre em contato conosco o quanto antes.
        </Text>

        <Text style={footer}>
          Obrigado pela preferência!
          <br />
          Equipe de Atendimento
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AppointmentReminder;

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
};

const h1 = {
  color: '#333',
  fontSize: '24px',
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

const detailsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px 40px',
  margin: '24px 40px',
  border: '1px solid #e9ecef',
};

const detailLabel = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '12px 0 4px 0',
  padding: '0',
};

const detailValue = {
  color: '#333',
  fontSize: '16px',
  margin: '0 0 12px 0',
  padding: '0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 0 0 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};
