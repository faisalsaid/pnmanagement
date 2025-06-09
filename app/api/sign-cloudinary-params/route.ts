import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  // console.log('CLOUDINARY ROUTE', process.env.CLOUDINARY_API_SECRET);

  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return Response.json({ signature });
}
