"use client";

import React, { useState } from "react";
import AdminRequestsList from "@/components/timekeeping/AdminRequestsList";
import {
  TimekeepingContainer,
} from "./timekeepingStyle";

const Timekeeping: React.FC = () => {

  return (
    <TimekeepingContainer>
      <AdminRequestsList />
    </TimekeepingContainer>
  );
};

export default Timekeeping;

