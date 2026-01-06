import { User } from './user.model';
import { USER_ROLE } from './user.constant';

// 1. Helper to find the last created Admin ID (e.g., "AD-005")
const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    { role: USER_ROLE.ADMIN },
    { id: 1, _id: 0 } // Select only the 'id' field
  )
    .sort({ createdAt: -1 }) // Sort by newest
    .lean();

  // Return the ID string or undefined if no admin exists yet
  return lastAdmin?.id ? lastAdmin.id.substring(3) : undefined; // Remove "AD-" prefix
};

// 2. Helper to find the last created Student ID (e.g., "STU-005")
const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    { role: USER_ROLE.STUDENT },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id.substring(4) : undefined; // Remove "STU-" prefix
};

// 3. MAIN FUNCTION: Generate Admin ID
export const generateAdminId = async () => {
  let currentId = (0).toString(); // Default start 0
  
  const lastAdminId = await findLastAdminId(); // e.g. "005"
  if (lastAdminId) {
    currentId = lastAdminId;
  }

  // Increment by 1 and pad with zeros
  let incrementId = (Number(currentId) + 1).toString().padStart(3, '0');
  
  return `AD-${incrementId}`;
};

// 4. MAIN FUNCTION: Generate Student ID
export const generateStudentId = async () => {
  let currentId = (0).toString();
  
  const lastStudentId = await findLastStudentId();
  if (lastStudentId) {
    currentId = lastStudentId;
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(3, '0');
  
  return `STU-${incrementId}`;
};