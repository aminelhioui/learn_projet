import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Composant simple d'inscription utilisateur
const Register = () => {
  return (
    <div>
      <h1>Create a new User</h1>
      <Form>
        {/* Champs du formulaire d'inscription */}
        <Form.Group className="mb-3">
          <Form.Label>User Name</Form.Label>
          <Form.Control type="text" placeholder="Enter user name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" placeholder="Enter phone number" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select aria-label="Role select">
            <option value="">Select role</option>
            <option value="ADMIN">Admin</option>
            <option value="RECRUT">Recruiter</option>
            <option value="CURRENT">Current</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Register;
