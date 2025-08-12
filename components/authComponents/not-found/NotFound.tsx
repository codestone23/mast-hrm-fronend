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

  return (
    <NotFoundContainer>
      <NotFoundRow>
        <NotFoundContent>
          <FourZeroFourBg>
            <h1>404</h1>
          </FourZeroFourBg>

          <ContentBox404>
            <h3>Look like you&apos;re lost</h3>
            <p>The page you are looking for is not available!</p>

            <Link404 onClick={handleGoHome}>
              Go to Home
            </Link404>
          </ContentBox404>
        </NotFoundContent>
      </NotFoundRow>
    </NotFoundContainer>
  );
};

export default NotFoundPage;