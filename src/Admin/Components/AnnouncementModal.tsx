import { useState } from "react";
import AnnouncementCollege from "./AnnouncementCollege";
import AnnouncementGroup from "./AnnouncementGroup";

interface AnnouncementDetails {
  title: string;
  description: string;
  group: string;
  college: string;
}

interface AnnouncementModalProps {
  setAnnouncementModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnnouncementModal = ({
  setAnnouncementModal,
}: AnnouncementModalProps) => {
  const [announcementData, setAnnouncementData] = useState<AnnouncementDetails>(
    {
      title: "",
      description: "",
      group: "",
      college: "",
    },
  );

  function submitForm() {
    if (announcementData.college === "") return alert("Select a college!");
    if (announcementData.group === "") return alert("Select a group!");

    //ANNOUNCMENT DETAILS OBJECT TO BE SENT TO SERVER:
    const newAnnouncementFormDetails: AnnouncementDetails = {
      title: announcementData.title.trim(),
      description: announcementData.description.trim(),
      group: announcementData.group,
      college: announcementData.college,
    };

    // VERIFY ANNOUNCEMENT DETAILS
    console.log("pingFormDetails: ", newAnnouncementFormDetails);

    setAnnouncementModal(false);

    // RESET ANNOUNCEMENT FORM
    setAnnouncementData({
      title: "",
      description: "",
      group: "",
      college: "",
    });
  }

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className="mx-5 shadow-2xl w-full max-w-[610px] rounded-4xl px-[25px] py-2.5 md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <h2 className="font-semibold text-center text-[20px] md:text-[32px]">
          Announcement
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className="w-full"
        >
          <fieldset className=" w-full  text-[14px] flex flex-col gap-5">
            <div className="flex px-[11px] py-3 border border-black rounded-[10px]">
              <label htmlFor="announcementTitl" className="font-semibold">
                Title :
              </label>
              <input
                type="text"
                id="announcementTitle"
                name="announcementTitle"
                required
                placeholder="name, header..."
                onChange={(e) =>
                  setAnnouncementData({
                    ...announcementData,
                    title: e.target.value,
                  })
                }
                value={announcementData.title}
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
                autoComplete="off"
              />
            </div>

            <div className="flex px-[11px] items-start h-[130px] py-3 border border-black rounded-[10px]">
              <label
                htmlFor="announcementDescription"
                className="font-semibold"
              >
                Description :
              </label>
              <textarea
                name="announcementDescription"
                id="announcementDescription"
                required
                placeholder="What's the announcement?"
                onChange={(e) =>
                  setAnnouncementData({
                    ...announcementData,
                    description: e.target.value,
                  })
                }
                value={announcementData.description}
                autoComplete="off"
                className="pl-[11px] text-[12px] mt-0.5 h-full resize-none w-full text-[#454545] outline-0 flex-1"
              />
            </div>

            <div className="flex flex-col items-center my-4 gap-8">
              <div className="overflow-y-scroll [scrollbar-width:none]">
                <AnnouncementGroup
                  group={announcementData.group}
                  setGroup={(group) =>
                    setAnnouncementData({ ...announcementData, group: group })
                  }
                />
              </div>
              <div className="overflow-y-scroll [scrollbar-width:none]">
                <AnnouncementCollege
                  college={announcementData.college}
                  setCollege={(college) =>
                    setAnnouncementData({
                      ...announcementData,
                      college: college,
                    })
                  }
                />
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="text-[18px] my-[25px] text-white py-2 text-center w-full bg-[#F49B31] rounded-[17px]"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={() => setAnnouncementModal(false)}
            className="text-[18px] py-2 text-center underline w-full rounded-[17px]"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
