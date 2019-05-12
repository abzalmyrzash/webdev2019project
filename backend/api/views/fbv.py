
from django.http import JsonResponse,HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.serializers import PostSerializer
from api.models import Group,Post


@api_view(['GET','DELETE','PUT'])
def post_detail(request,pk2):
    try:
        post=Post.objects.get(id=pk2)
    except Post.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer=PostSerializer(post)
        return Response(serializer.data)
    if request.user!=post.created_by:
        return Response('not correct user')

    if request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    if request.method == 'PUT':

        serializer=PostSerializer(instance=post,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_204_NO_CONTENT)
