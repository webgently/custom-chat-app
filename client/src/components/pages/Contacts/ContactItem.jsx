import React from "react";
import useChat from "../../../hooks/useChat";
import useTime from "../../../hooks/useTime";
import Image from "../../globals/Image";

function ContactItem({
  contact: { name: contactName, contactDetails, chatRoomId },
}) {
  const formattedTime = useTime(contactDetails.status.lastSeen);
  const { setChatRoom } = useChat({ contactName, contactDetails, chatRoomId });
  return (
    <div
      onClick={setChatRoom}
      className="flex py-[1rem] px-[1.5rem] gap-[1rem]"
    >
      {/* Avatar */}
      <div className="relative">
        <Image
          src={contactDetails.avatar}
          alt={contactName}
          className="w-[5rem] h-[5rem] rounded-full"
        />
        {contactDetails.status.online && (
          <span className="absolute right-1 bottom-1 rounded-full border-[6px] border-[#23a55a]" />
        )}
      </div>

      {/* Details */}
      <div className="">
        <p className="font-semibold cursor-default">{contactName}</p>
        <p className="text-secondary-text text-[1.5rem] cursor-default">
          {contactDetails.status.online
            ? "online"
            : `last seen at ${formattedTime}`}
        </p>
      </div>
    </div>
  );
}

export default ContactItem;
