"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import TextArea from "@/components/common/TextArea/TextArea";
import Select from "@/components/common/Select/Select";
import DatePicker from "@/components/common/DatePicker/DatePicker";
import { MeetingRoom, CreateMeetingPayload, Meeting } from "@/types/api";
import {
  BookingForm,
  FormRow,
  FormActions,
} from "./meetingBookingStyle";

interface MeetingBookingProps {
  rooms: MeetingRoom[];
  selectedDate?: Date;
  selectedTimeSlot?: { start: string; end: string };
  selectedMeeting?: Meeting | null;
  selectedRoomIdProp?: number;
  onSubmit: (data: CreateMeetingPayload) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  isReadOnly?: boolean;
}

interface FormData {
  room_id: number;
  title: string;
  description: string;
  booking_date: string;
  start_hour: string;
  end_hour: string;
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  // Chỉ tạo khung giờ từ 8h đến 18h
  for (let hour = 8; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 18) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

const MeetingBooking: React.FC<MeetingBookingProps> = ({
  rooms,
  selectedDate,
  selectedMeeting,
  selectedRoomIdProp,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditMode = false,
  isReadOnly = false,
}) => {
  const timeSlots = generateTimeSlots();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      room_id: selectedRoomIdProp || rooms[0]?.id || 0,
      title: "",
      description: "",
      booking_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      start_hour: selectedDate ? format(selectedDate, "HH:mm") : "",
      end_hour: "",
    },
    mode: "onChange",
  });

  const bookingDate = watch("booking_date");
  const roomId = watch("room_id");
  const selectedStartHour = watch("start_hour");
  const selectedEndHour = watch("end_hour");

  useEffect(() => {
    if (selectedDate) {
      setValue("booking_date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  // Điền dữ liệu từ selectedMeeting khi ở edit mode
  useEffect(() => {
    if (isEditMode && selectedMeeting) {
      const meetingStart = new Date(selectedMeeting.start_time);
      const meetingEnd = new Date(selectedMeeting.end_time);
      
      setValue("room_id", selectedMeeting.room_id);
      setValue("title", selectedMeeting.title);
      setValue("description", selectedMeeting.description || "");
      setValue("booking_date", format(meetingStart, "yyyy-MM-dd"));
      setValue("start_hour", format(meetingStart, "HH:mm"));
      setValue("end_hour", format(meetingEnd, "HH:mm"));
    }
  }, [isEditMode, selectedMeeting, setValue]);

  const handleStartHourSelect = (hour: string) => {
    setValue("start_hour", hour, { shouldValidate: true });
    if (selectedEndHour && hour >= selectedEndHour) {
      setValue("end_hour", "", { shouldValidate: true });
    }
  };

  const handleEndHourSelect = (hour: string) => {
    setValue("end_hour", hour, { shouldValidate: true });
  };

  const onSubmitForm = (data: FormData) => {
    // Kiểm tra lại ngày đặt không phải thứ 7 hoặc chủ nhật
    if (data.booking_date) {
      const bookingDate = new Date(data.booking_date);
      const dayOfWeek = bookingDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return;
      }
    }
    
    onSubmit(data);
  };

  const roomOptions = rooms.map((room) => ({
    value: room.id,
    label: room.name,
  }));

  const startHourIndex = timeSlots.indexOf(selectedStartHour);
  const availableEndSlots = selectedStartHour
    ? timeSlots.slice(startHourIndex + 1)
    : [];

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <BookingForm onSubmit={handleSubmit(onSubmitForm)}>
      <FormRow $inline>
        <Select
          label="Phòng họp"
          options={roomOptions}
          value={roomId}
          onChange={(value) => setValue("room_id", value as number)}
          required
          disabled={isReadOnly}
          error={errors.room_id?.message}
        />
        <DatePicker
          label="Ngày đặt"
          value={bookingDate ? new Date(bookingDate) : null}
          onChange={(date) => {
            if (date) {
              const dayOfWeek = date.getDay();
              if (dayOfWeek === 0 || dayOfWeek === 6) {
                setValue("booking_date", "", { shouldValidate: true });
                return;
              }
              setValue("booking_date", format(date, "yyyy-MM-dd"), { shouldValidate: true });
            }
          }}
          minDate={minDate}
          required
          disabled={isReadOnly}
          error={errors.booking_date?.message}
          shouldDisableDate={(date) => {
            // Disable thứ 7 (6) và chủ nhật (0)
            const dayOfWeek = date.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6;
          }}
        />
      </FormRow>

      <FormRow $inline>
        <Select
          label="Giờ bắt đầu"
          {
            ...register("start_hour", { required: "Vui lòng chọn giờ bắt đầu" })
          }
          options={timeSlots.map((slot) => ({ value: slot, label: slot }))}
          value={selectedStartHour}
          onChange={(value) => handleStartHourSelect(value as string)}
          placeholder="Chọn giờ bắt đầu"
          required
          disabled={isReadOnly}
          error={errors.start_hour?.message}
        />
        <Select
          label="Giờ kết thúc"
          {...register("end_hour", { 
            required: "Vui lòng chọn giờ kết thúc",
            validate: (value) => {
              if (selectedStartHour && value <= selectedStartHour) {
                return "Giờ kết thúc phải sau giờ bắt đầu";
              }
              return true;
            }
          })}
          options={availableEndSlots.map((slot) => ({ value: slot, label: slot }))}
          value={selectedEndHour}
          onChange={(value) => handleEndHourSelect(value as string)}
          placeholder="Chọn giờ kết thúc"
          required
          disabled={isReadOnly || !selectedStartHour}
          error={errors.end_hour?.message}
        />
      </FormRow>

      <FormRow>
        <Input
          label="Tiêu đề"
          {...register("title", { required: "Vui lòng nhập tiêu đề" })}
          required
          disabled={isReadOnly}
          error={errors.title?.message}
          placeholder="Nhập tiêu đề cuộc họp"
        />
      </FormRow>

      <FormRow>
        <TextArea
          label="Mô tả"
          {...register("description")}
          rows={4}
          disabled={isReadOnly}
          placeholder="Nhập mô tả cuộc họp (tùy chọn)"
        />
      </FormRow>

      {!isReadOnly && (
        <FormActions>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
          >
            {isEditMode ? "Cập nhật" : "Đặt phòng"}
          </Button>
        </FormActions>
      )}
    </BookingForm>
  );
};

export default MeetingBooking;
