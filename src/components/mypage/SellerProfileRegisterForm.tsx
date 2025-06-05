import { useState } from 'react';
import styled from '@emotion/styled';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api/client';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 70px;
`;

const Label = styled.label`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.medium};
  margin-bottom: ${spacing[1]};
`;

const RequiredMark = styled.span`
  color: ${colors.error.main};
  margin-left: 4px;
`;

const ValidationMessage = styled.span<{ isValid?: boolean; isError?: boolean }>`
  font-size: ${typography.fontSize.xs};
  color: ${props => props.isError ? colors.error.main : props.isValid ? colors.success.main : colors.gray[500]};
  margin-top: 2px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MessageRight = styled.span`
  font-size: ${typography.fontSize.xs};
  color: ${colors.gray[500]};
  margin-left: 8px;
  min-width: 180px;
  text-align: right;
`;

const AccountButtonRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AccountActionButton = styled(Button)`
  min-width: 80px;
  height: 40px;
  font-size: 1rem;
`;

const DisabledInputStyle = {
  background: colors.gray[100],
  color: colors.gray[500],
  cursor: 'not-allowed',
  borderColor: colors.gray[300],
};

// 은행코드 예시 (실제 은행코드 리스트는 추후 확장)
const BANKS = [
  { code: '004', name: 'KB국민은행' },
  { code: '088', name: '신한은행' },
  { code: '020', name: '우리은행' },
  { code: '081', name: '하나은행' },
  { code: '003', name: 'IBK기업은행' },
  { code: '011', name: 'NH농협' },
  { code: '023', name: 'SC제일은행' },
  { code: '027', name: '씨티은행' },
  { code: '039', name: '경남은행' },
  { code: '034', name: '광주은행' },
  { code: '031', name: '대구은행' },
  { code: '032', name: '부산은행' },
  { code: '045', name: '새마을금고' },
  { code: '071', name: '우체국' },
  { code: '037', name: '전북은행' },
  { code: '035', name: '제주은행' },
  { code: '007', name: '수협' },
  { code: '048', name: '신협' },
];

interface Props {
  userId: string;
  onSuccess?: () => void;
}

export default function SellerProfileRegisterForm({ userId, onSuccess }: Props) {
  const router = useRouter();
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bizTouched, setBizTouched] = useState(false);

  // 정규식 및 검증
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    // 사업자등록번호: 3-2-5 자리 또는 빈값 허용
    if (businessRegistrationNumber && !/^\d{3}-\d{2}-\d{5}$/.test(businessRegistrationNumber)) {
      newErrors.businessRegistrationNumber = '사업자등록번호는 3-2-5자리(예: 123-45-67890) 형식이어야 합니다.';
    }
    if (!bankCode) newErrors.bankCode = '은행을 선택하세요.';
    if (!accountNumber) newErrors.accountNumber = '계좌번호를 입력하세요.';
    if (!accountHolderName) newErrors.accountHolderName = '예금주명을 입력하세요.';
    else if (!/^[가-힣a-zA-Z\s]{2,20}$/.test(accountHolderName)) newErrors.accountHolderName = '예금주명은 한글/영문 2~20자여야 합니다.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      // 실제 등록 API 호출
      await apiClient.post('/api/v1/seller-profiles', {
        userId,
        businessRegistrationNumber: businessRegistrationNumber || undefined,
        bankAccountInfo: {
          bankCode,
          accountNumber,
          accountHolderName,
        },
      });
      // POST 후 GET으로 데이터 확인
      const { data } = await apiClient.get(`/api/v1/seller-profiles/users/${userId}`);
      if (data && data.sellerProfileId) {
        router.replace('/my/seller-profile');
        window.location.reload();
      } else {
        setErrors({ form: '프로필 생성 후 데이터 확인에 실패했습니다. 새로고침 후 다시 시도해 주세요.' });
      }
      if (onSuccess) onSuccess();
    } catch {
      setErrors({ form: '등록에 실패했습니다. 다시 시도해 주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAccount = async () => {
    setIsVerifying(true);
    // TODO: 실제 계좌 인증 API 연동
    setTimeout(() => {
      setIsVerified(true);
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <LabelRow>
          <Label htmlFor="businessRegistrationNumber">사업자등록번호 <span style={{ color: colors.text.secondary, fontWeight: 400 }}>(선택)</span></Label>
          <MessageRight>
            {bizTouched && businessRegistrationNumber && (
              /^\d{3}-\d{2}-\d{5}$/.test(businessRegistrationNumber)
                ? <span style={{ color: colors.success.main }}>올바른 형식입니다.</span>
                : <span style={{ color: colors.error.main }}>{errors.businessRegistrationNumber || '형식이 올바르지 않습니다.'}</span>
            )}
          </MessageRight>
        </LabelRow>
        <Input
          id="businessRegistrationNumber"
          name="businessRegistrationNumber"
          value={businessRegistrationNumber}
          onChange={e => {
            // 숫자만 입력, 자동 하이픈
            let v = e.target.value.replace(/[^0-9]/g, '');
            if (v.length > 10) v = v.slice(0, 10);
            let formatted = v;
            if (v.length > 5) formatted = v.slice(0,3) + '-' + v.slice(3,5) + '-' + v.slice(5);
            else if (v.length > 3) formatted = v.slice(0,3) + '-' + v.slice(3);
            setBusinessRegistrationNumber(formatted);
          }}
          onBlur={() => setBizTouched(true)}
          placeholder="숫자만 입력 (예: 1234511111)"
          maxLength={12}
          disabled={isSubmitting}
          inputMode="numeric"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="bankCode">은행 <RequiredMark>*</RequiredMark></Label>
        <select
          id="bankCode"
          name="bankCode"
          value={bankCode}
          onChange={e => setBankCode(e.target.value)}
          style={{
            height: 40,
            borderRadius: 4,
            border: `1px solid ${isVerified ? colors.gray[300] : errors.bankCode ? colors.error.main : colors.gray[300]}`,
            padding: '0 12px',
            fontSize: 16,
            background: isVerified ? colors.gray[100] : undefined,
            color: isVerified ? colors.gray[500] : undefined,
            cursor: isVerified ? 'not-allowed' : undefined,
          }}
          disabled={isVerified}
        >
          <option value="">은행을 선택하세요</option>
          {BANKS.map(bank => (
            <option key={bank.code} value={bank.code}>{bank.name}</option>
          ))}
        </select>
        {errors.bankCode && <ValidationMessage isError>{errors.bankCode}</ValidationMessage>}
      </FormGroup>
      <FormGroup>
        <Label htmlFor="accountNumber">계좌번호 <RequiredMark>*</RequiredMark></Label>
        <AccountButtonRow>
          <Input
            id="accountNumber"
            name="accountNumber"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="계좌번호(숫자만 입력)"
            maxLength={20}
            style={{ flex: 1, ...(isVerified ? DisabledInputStyle : {}) }}
            disabled={isVerified}
          />
          <AccountActionButton
            type="button"
            variant={isVerified ? 'primary' : 'secondary'}
            onClick={handleVerifyAccount}
            disabled={isVerifying || !bankCode || !accountNumber || !accountHolderName || isVerified}
          >
            {isVerifying ? <FaSpinner className="spin" /> : isVerified ? <FaCheckCircle /> : '계좌 인증'}
          </AccountActionButton>
          {isVerified && (
            <AccountActionButton
              type="button"
              variant="outline"
              size="small"
              onClick={() => {
                setIsVerified(false);
                setBankCode('');
                setAccountNumber('');
                setAccountHolderName('');
              }}
            >
              초기화
            </AccountActionButton>
          )}
        </AccountButtonRow>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="accountHolderName">예금주명 <RequiredMark>*</RequiredMark></Label>
        <Input
          id="accountHolderName"
          name="accountHolderName"
          value={accountHolderName}
          onChange={e => setAccountHolderName(e.target.value)}
          placeholder="예금주명을 입력하세요"
          maxLength={20}
          style={isVerified ? DisabledInputStyle : {}}
          disabled={isVerified}
        />
        {errors.accountHolderName && <ValidationMessage isError>{errors.accountHolderName}</ValidationMessage>}
      </FormGroup>
      {errors.form && <ValidationMessage isError>{errors.form}</ValidationMessage>}
      <Button type="submit" variant="primary" size="large" fullWidth disabled={isSubmitting || !isVerified}>
        {isSubmitting ? '등록 중...' : '셀러 프로필 등록하기'}
      </Button>
    </Form>
  );
} 