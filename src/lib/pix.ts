// Gerador de payload PIX estático (Pix Copia e Cola / QR Code)
// Segue especificação do Banco Central do Brasil — EMV QR Code MPM

function field(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`
}

function crc16(str: string): string {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
}

function normalize(s: string, maxLen: number): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .trim()
    .substring(0, maxLen)
    .toUpperCase()
}

export function generatePixPayload(opts: {
  pixKey: string
  merchantName: string
  merchantCity?: string
  amount: number
  txId?: string
}): string {
  const { pixKey, merchantName, amount, txId = '***' } = opts
  const city = normalize(opts.merchantCity || 'BRASIL', 15)
  const name = normalize(merchantName || 'LOJA', 25)

  const merchantAccount = field('00', 'BR.GOV.BCB.PIX') + field('01', pixKey.trim())
  const additionalData  = field('05', txId.substring(0, 25))

  const payload =
    field('00', '01') +
    field('26', merchantAccount) +
    field('52', '0000') +
    field('53', '986') +
    field('54', amount.toFixed(2)) +
    field('58', 'BR') +
    field('59', name) +
    field('60', city) +
    field('62', additionalData) +
    '6304'   // CRC header (valor calculado a seguir)

  return payload + crc16(payload)
}
