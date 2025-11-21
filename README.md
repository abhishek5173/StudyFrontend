****************************************Frontend*******************************
1. npm install axios
2. Create a helper utils/axiosInstance.js  - So you dont have to repeat the baseUrl in every request
3. Add Auth Context - context/AuthContext.tsx - We store token globally so every component can access it.
4. Wrap the whole App in AuthContext in layout.tsx
5. Protected Route Wrapper - /components/protectedRoute.tsx - Prevents unauthorized users from accessing dashboard or editor pages.
6. Create Pages - Login/Register/Dashboard

******************************************************************************************

**Implement Login + Register**

1. Create Register page and logic
2. Create Login Page and logic
3. Token handling and Axios Authorization in utils/axiosInstance.ts - You add an Axios Request Interceptor, which automatically attaches the token:

**********************************************End*******************************************