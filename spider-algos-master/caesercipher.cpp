#include<iostream>
using namespace std;
int main()
{
	int n, k, i, j, temp;
	cin>>n>>k;
	
//	making shift cyclic of 26 wont't effect
	k = k % 26;
    string a[100];
	
	for(j = 0 ; j < 2 * n; ++j)
	{
		cin>>a[j];
	}
	
	for(j = 0; j < n; ++j)
	{
	
		for(i = 0; i < a[j].length(); ++i)
		{		
			if(a[j][i] >= 'A' && a[j][i] <= 'Z')
			{
//				if char value exceeds 128 it becomes negative hence calc done in integer variables
				temp = a[j][i];
				temp = temp + k;
				if(temp > 'Z')
				{
					a[j][i] = temp - 'Z' + 'A' - 1;
				}
			   else
			   {
			   		a[j][i] = a[j][i] + k;
			   }
			
			}
			else if(a[j][i] >= 'a' && a[j][i] <= 'z')
			{
//				if char value exceeds 128 it becomes negative hence calc done in integer variables
				temp = a[j][i];
				temp = temp + k;
				if(temp > 'z')
				{
					a[j][i] = temp - 'z' + 'a' - 1;
				}
			   	else
			   {
			   		a[j][i] = a[j][i] + k;
			   }
			}
		}
		
		cout<<"ciphertext#"<<j + 1<<":"<<a[j]<<endl;
	}
	
	for(j = n; j < 2 * n; ++j)
	{
	
		for(i = 0; i < a[j].length(); ++i)
		{
//			since while subtracting [0-25] it wont reach negative values hence normal condition
			if(a[j][i] >= 'A' && a[j][i] <= 'Z')
			{
				a[j][i] = a[j][i] - k;
				if(a[j][i] < 'A')
				{
					a[j][i] = a[j][i] + 'Z' - 'A' + 1;
				}
		
			}
			else if(a[j][i] >= 'a' && a[j][i] <= 'z')
			{
		
				a[j][i] = a[j][i] - k;
				
				if(a[j][i] < 'a')
				{
					a[j][i] = a[j][i] + 'z' - 'a' + 1;
				}
		
			}
	
		}
		
	cout<<"plaintext#"<<j - n + 1<<":"<<a[j]<<endl;
		
	}
}
