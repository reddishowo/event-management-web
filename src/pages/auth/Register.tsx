import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, watch } = useForm<RegisterForm>();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerUser(data.name, data.email, data.password);
      alert("Registration successful. Please log in.");
      window.location.href = "/auth/Login"; 
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white shadow-lg rounded"
      >
        <h1 className="text-2xl mb-4">Register</h1>
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-4"
        />
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
        />
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
        />
        <input
          {...register("confirmPassword", { required: true })}
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
