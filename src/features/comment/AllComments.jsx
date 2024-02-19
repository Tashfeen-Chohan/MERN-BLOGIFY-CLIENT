import React from "react";
import { useGetAllCommentsQuery } from "./commentApi";
import { BeatLoader } from "react-spinners";
import { MdDelete, MdOutlinePreview } from "react-icons/md";
import moment from "moment";

const AllComments = () => {
  const { data, isLoading } = useGetAllCommentsQuery("/comments");

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const { comments, totalComments } = data ?? {};

  return (
    <div>
      <div className="w-[95%] md:max-w-5xl mx-auto">
        <table
          className={
            "min-w-full border-collapse block md:table mt-3 mb-5 shadow-xl"
          }
        >
          <thead className="block md:table-header-group bg-slate-300 text-black">
            <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                #
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Post
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Username
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Content
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Likes
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Date
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group font-semibold! text-sm md:text-xs">
            {comments?.map((val, index) => (
              <tr
                key={val._id}
                className="userTable my-3 rounded shadow-md md:shadow-none border border-grey-500 md:border-none block md:table-row hover:bg-gray-200"
              >
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    #
                  </span>
                  {index + 1}
                  {/* {(page - 1) * limit + index + 1} */}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Post
                  </span>
                  {val.postId.title}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Username
                  </span>
                  {val.userId.username}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Content
                  </span>
                  {val.content}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Likes
                  </span>
                  {val.likes}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Date
                  </span>
                  {moment(val.createdAt).fromNow()}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Actions
                  </span>
                  <button className="mr-2">
                    <MdOutlinePreview size={25} color="blue"/>
                  </button>
                  <button>
                    <MdDelete size={25} color="red"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllComments;
