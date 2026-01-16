

export const loader: LoaderFunction = () => {
  const bingSiteAuth = `<?xml version="1.0"?>
<users>
  <user>CE51222493EB040B52D11391EE8FC5F3</user>
</users>`
  return new Response(bingSiteAuth, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
