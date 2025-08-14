import React from "react";
import { useRouter } from "next/navigation";
import {
  NotFoundContainer,
  NotFoundRow,
  NotFoundContent,
  FourZeroFourBg,
  ContentBox404,
  Link404,
} from "./notFoundStyle";

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <NotFoundContainer>
      <NotFoundRow>
        <NotFoundContent>
          <FourZeroFourBg>
            <h1>404</h1>
          </FourZeroFourBg>

          <ContentBox404>
            <h3>Có vẻ như bạn đã lạc đường</h3>
            <p>Trang bạn đang tìm kiếm không tồn tại!</p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link404 onClick={handleGoBack}>
                Quay lại
              </Link404>
              <Link404 onClick={handleGoHome}>
                Về trang chủ
              </Link404>
            </div>
          </ContentBox404>
        </NotFoundContent>
      </NotFoundRow>
    </NotFoundContainer>
  );
};

export default NotFoundPage;