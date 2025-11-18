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

export interface QuotationService {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuotationPart {
  name: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuotationEmailProps {
  clientName: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  vehicleInfo?: string;
  services: QuotationService[];
  parts?: QuotationPart[];
  subtotalServices: number;
  subtotalParts: number;
  discount?: number;
  total: number;
  paymentConditions?: string;
  notes?: string;
  partnerName?: string;
  partnerPhone?: string;
  partnerEmail?: string;
}

export const QuotationEmail = ({
  clientName,
  quotationNumber,
  quotationDate,
  validUntil,
  vehicleInfo,
  services,
  parts = [],
  subtotalServices,
  subtotalParts,
  discount = 0,
  total,
  paymentConditions,
  notes,
  partnerName,
  partnerPhone,
  partnerEmail,
}: QuotationEmailProps) => (
  <Html>
    <Head />
    <Preview>Cotação #{quotationNumber} - Confira nossa proposta de serviços</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Cotação de Serviços</Heading>
          {partnerName && (
            <Text style={partnerNameText}>{partnerName}</Text>
          )}
        </Section>

        <Section style={infoBox}>
          <Text style={infoTitle}>Informações da Cotação</Text>
          
          <Section style={infoGrid}>
            <Text style={infoLabel}>Cliente:</Text>
            <Text style={infoValue}>{clientName}</Text>
          </Section>

          <Section style={infoGrid}>
            <Text style={infoLabel}>Cotação Nº:</Text>
            <Text style={infoValue}>{quotationNumber}</Text>
          </Section>

          <Section style={infoGrid}>
            <Text style={infoLabel}>Data:</Text>
            <Text style={infoValue}>{quotationDate}</Text>
          </Section>

          <Section style={infoGrid}>
            <Text style={infoLabel}>Válida até:</Text>
            <Text style={infoValue}>{validUntil}</Text>
          </Section>

          {vehicleInfo && (
            <Section style={infoGrid}>
              <Text style={infoLabel}>Veículo:</Text>
              <Text style={infoValue}>{vehicleInfo}</Text>
            </Section>
          )}
        </Section>

        <Hr style={divider} />

        {/* Services Section */}
        <Section style={itemsSection}>
          <Text style={sectionTitle}>🔧 Serviços</Text>
          
          <Section style={tableHeader}>
            <Text style={{...tableHeaderCell, width: '50%'}}>Descrição</Text>
            <Text style={{...tableHeaderCell, width: '15%'}}>Qtd</Text>
            <Text style={{...tableHeaderCell, width: '20%'}}>Valor Unit.</Text>
            <Text style={{...tableHeaderCell, width: '15%'}}>Subtotal</Text>
          </Section>

          {services.map((service, index) => (
            <Section key={index} style={tableRow}>
              <Text style={{...tableCell, width: '50%'}}>{service.description}</Text>
              <Text style={{...tableCell, width: '15%', textAlign: 'center' as const}}>{service.quantity}</Text>
              <Text style={{...tableCell, width: '20%', textAlign: 'right' as const}}>
                R$ {service.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={{...tableCell, width: '15%', textAlign: 'right' as const}}>
                R$ {service.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </Section>
          ))}

          <Section style={subtotalRow}>
            <Text style={subtotalLabel}>Subtotal Serviços:</Text>
            <Text style={subtotalValue}>
              R$ {subtotalServices.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </Section>
        </Section>

        {/* Parts Section */}
        {parts.length > 0 && (
          <>
            <Hr style={divider} />
            <Section style={itemsSection}>
              <Text style={sectionTitle}>🔩 Peças e Materiais</Text>
              
              <Section style={tableHeader}>
                <Text style={{...tableHeaderCell, width: '40%'}}>Descrição</Text>
                <Text style={{...tableHeaderCell, width: '15%'}}>Código</Text>
                <Text style={{...tableHeaderCell, width: '10%'}}>Qtd</Text>
                <Text style={{...tableHeaderCell, width: '20%'}}>Valor Unit.</Text>
                <Text style={{...tableHeaderCell, width: '15%'}}>Subtotal</Text>
              </Section>

              {parts.map((part, index) => (
                <Section key={index} style={tableRow}>
                  <Text style={{...tableCell, width: '40%'}}>{part.name}</Text>
                  <Text style={{...tableCell, width: '15%'}}>{part.code || '-'}</Text>
                  <Text style={{...tableCell, width: '10%', textAlign: 'center' as const}}>{part.quantity}</Text>
                  <Text style={{...tableCell, width: '20%', textAlign: 'right' as const}}>
                    R$ {part.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={{...tableCell, width: '15%', textAlign: 'right' as const}}>
                    R$ {part.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </Section>
              ))}

              <Section style={subtotalRow}>
                <Text style={subtotalLabel}>Subtotal Peças:</Text>
                <Text style={subtotalValue}>
                  R$ {subtotalParts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </Section>
            </Section>
          </>
        )}

        <Hr style={divider} />

        {/* Total Section */}
        <Section style={totalSection}>
          {discount > 0 && (
            <Section style={discountRow}>
              <Text style={discountLabel}>Desconto:</Text>
              <Text style={discountValue}>
                - R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </Section>
          )}

          <Section style={totalRow}>
            <Text style={totalLabel}>VALOR TOTAL:</Text>
            <Text style={totalValue}>
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </Section>
        </Section>

        {/* Payment Conditions */}
        {paymentConditions && (
          <Section style={conditionsBox}>
            <Text style={conditionsTitle}>💳 Condições de Pagamento</Text>
            <Text style={conditionsText}>{paymentConditions}</Text>
          </Section>
        )}

        {/* Notes */}
        {notes && (
          <Section style={notesBox}>
            <Text style={notesTitle}>📝 Observações</Text>
            <Text style={notesText}>{notes}</Text>
          </Section>
        )}

        <Hr style={divider} />

        {/* Call to Action */}
        <Section style={ctaSection}>
          <Text style={ctaTitle}>✅ Gostou da Proposta?</Text>
          <Text style={ctaText}>
            Entre em contato conosco para confirmar o agendamento e dar início aos serviços.
          </Text>
          <Text style={ctaText}>
            <strong>Estamos à disposição para esclarecer qualquer dúvida!</strong>
          </Text>
        </Section>

        {/* Validity Warning */}
        <Section style={validityBox}>
          <Text style={validityText}>
            ⏰ Esta cotação é válida até <strong>{validUntil}</strong>
          </Text>
        </Section>

        {/* Footer */}
        <Text style={footer}>
          {partnerName && (
            <>
              <strong>{partnerName}</strong><br />
            </>
          )}
          {partnerPhone && (
            <>
              📞 {partnerPhone}<br />
            </>
          )}
          {partnerEmail && (
            <>
              📧 {partnerEmail}<br />
            </>
          )}
          <br />
          <span style={footerSmall}>
            Esta é uma cotação sem compromisso. Os valores e condições aqui apresentados podem sofrer alterações sem aviso prévio.
          </span>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default QuotationEmail;

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
  maxWidth: '700px',
};

const header = {
  padding: '40px 40px 20px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#1e40af',
  borderRadius: '12px 12px 0 0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const partnerNameText = {
  color: '#dbeafe',
  fontSize: '16px',
  margin: '8px 0 0 0',
  padding: '0',
};

const infoBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px 40px',
  margin: '20px 40px',
  border: '1px solid #e2e8f0',
};

const infoTitle = {
  color: '#1e40af',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  padding: '0',
};

const infoGrid = {
  display: 'flex' as const,
  justifyContent: 'space-between',
  margin: '8px 0',
};

const infoLabel = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
  fontWeight: '600',
};

const infoValue = {
  color: '#1e293b',
  fontSize: '14px',
  margin: '0',
  fontWeight: '600',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '24px 40px',
};

const itemsSection = {
  padding: '0 40px',
  margin: '20px 0',
};

const sectionTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  padding: '0',
};

const tableHeader = {
  backgroundColor: '#f1f5f9',
  padding: '12px',
  borderRadius: '6px',
  display: 'flex' as const,
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const tableHeaderCell = {
  color: '#475569',
  fontSize: '13px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const tableRow = {
  padding: '12px',
  borderBottom: '1px solid #f1f5f9',
  display: 'flex' as const,
  justifyContent: 'space-between',
};

const tableCell = {
  color: '#334155',
  fontSize: '14px',
  margin: '0',
  padding: '0',
};

const subtotalRow = {
  display: 'flex' as const,
  justifyContent: 'space-between',
  padding: '12px',
  backgroundColor: '#f8fafc',
  marginTop: '8px',
  borderRadius: '6px',
};

const subtotalLabel = {
  color: '#475569',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0',
};

const subtotalValue = {
  color: '#1e293b',
  fontSize: '15px',
  fontWeight: '700',
  margin: '0',
};

const totalSection = {
  padding: '0 40px',
  margin: '20px 0',
};

const discountRow = {
  display: 'flex' as const,
  justifyContent: 'space-between',
  padding: '8px 12px',
  marginBottom: '8px',
};

const discountLabel = {
  color: '#059669',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0',
};

const discountValue = {
  color: '#059669',
  fontSize: '15px',
  fontWeight: '700',
  margin: '0',
};

const totalRow = {
  display: 'flex' as const,
  justifyContent: 'space-between',
  padding: '16px',
  backgroundColor: '#1e40af',
  borderRadius: '8px',
};

const totalLabel = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const totalValue = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const conditionsBox = {
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
  padding: '16px 40px',
  margin: '20px 40px',
  border: '1px solid #86efac',
};

const conditionsTitle = {
  color: '#065f46',
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const conditionsText = {
  color: '#047857',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const notesBox = {
  backgroundColor: '#fffbeb',
  borderRadius: '8px',
  padding: '16px 40px',
  margin: '20px 40px',
  border: '1px solid #fbbf24',
};

const notesTitle = {
  color: '#92400e',
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const notesText = {
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const ctaSection = {
  backgroundColor: '#dbeafe',
  borderRadius: '12px',
  padding: '24px 40px',
  margin: '24px 40px',
  border: '1px solid #3b82f6',
  textAlign: 'center' as const,
};

const ctaTitle = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const ctaText = {
  color: '#1e3a8a',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const validityBox = {
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  padding: '12px 40px',
  margin: '20px 40px',
  border: '1px solid #fca5a5',
  textAlign: 'center' as const,
};

const validityText = {
  color: '#991b1b',
  fontSize: '14px',
  margin: '0',
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
  fontStyle: 'italic' as const,
};
