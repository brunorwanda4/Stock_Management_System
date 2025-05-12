import React from "react";

const RegisterForm = () => {
  // !username || !password || !role || !email
  return (
    <div className=" p-4 shadow bg-base-100 w-96">
      <form className=" space-y-4">
        <div className=" flex flex-col space-y-2">
          <label className=" label" htmlFor="">
            Email
          </label>
          <input
            required
            placeholder="bruno_rwanda"
            className=" input "
            type="email"
          />
        </div>
        <div className=" flex flex-col space-y-2">
          <label className=" label" htmlFor="">
            Username
          </label>
          <input placeholder="bruno_rwanda" className=" input " type="text" />
        </div>
        <div className=" flex flex-col space-y-2">
          <label className=" label" htmlFor="">
            user role
          </label>
          <select className=" select">
            <option className="" value="owner">Owner</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <div className=" flex flex-col space-y-2">
          <label className=" label" htmlFor="">
            Password
          </label>
          <input placeholder="******" className=" input " type="password" />
        </div>
        <button className=" btn btn-accent w-full ">
            Create account
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
