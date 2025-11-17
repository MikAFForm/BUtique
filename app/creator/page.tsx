export default function AccountCreator() {
  return (
    <div className="flex min-h-screen items-center justify-center">
        <form action="/api/create_account" method="POST" className="flex flex-col gap-4 p-6 border rounded">
            <label htmlFor="Email">Email</label>
            <input className="border border-gray-400 rounded p-2" type="text" id="name" name="email" required/>
                       <button
                className="
                    bg-purple-600 
                    text-white 
                    px-6 py-2 
                    rounded-lg 
                    shadow-md 
                    hover:bg-pink-700 
                    hover:scale-150 
                    transition 
                    duration-100
                ">
                Send Code
            </button>

            <label htmlFor="username">Username</label>
            <input className="border border-gray-400 rounded p-2" type="text" id="username" name="username" required/>

            <label htmlFor="password">Password</label>
            <input className="border border-gray-400 rounded p-2" type="text" id="password" name="password" required/>

            <label htmlFor="onetimecode">One Time Code</label>
            <input className="border border-gray-400 rounded p-2" type="text" id="onetimecode" name="onetimecode" required/>

           <button
                className="
                    bg-blue-600 
                    text-white 
                    px-6 py-2 
                    rounded-lg 
                    shadow-md 
                    hover:bg-blue-700 
                    hover:scale-150 
                    transition 
                    duration-200
                ">
                Add Account
            </button>
                                   <button
                className="
                    bg-pink-600 
                    text-white 
                    px-6 py-2 
                    rounded-lg 
                    shadow-md 
                    hover:bg-pink-700 
                    hover:scale-150 
                    transition 
                    duration-100
                ">
                Signin
            </button>
        </form>
    </div>
  );
}